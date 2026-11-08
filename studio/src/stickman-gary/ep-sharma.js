// 2026-11-08 YouTube "Sharma Ji Ka Beta Is Crying Now" (type 2/3 dark relatable comedy). Kalu (canon) on the sofa with chai, deadpan;
// Battery = Sharma ji ka beta: crashes through the window, zombie from success (dark circles, coffee drip pole, trophy);
// Kalu's mom = voice + bangled arm from the kitchen doorway; Battery's mom = phone call. Desi Goggle-Eye Toon (kp.js).
// Beats: A crash+hook | B Kalu CU "Bavan" + chappal | C mom arm / Battery adjusts specs | D Battery CU hoarse | E eye-twitch macro | F wide, drip pole |
// G Kalu "Accha" | H phone insert | I Battery CU crying call | J sobbing, trophy drops | K Kalu CU last line -> hard cut.
import { W, H, bind, ctx, lerp, clamp, ease, easeOut, back, label, captions, groupWords, finish, poly, ell, fillEll, fillPoly, line, rrect, dark, light, layer, blurred, shadowBlob } from '../toon/toon.js';
import { kpSeated, tube } from '../toon/kp.js';
import { KALU, BATTERY } from '../toon/kalu.js';
import { chaiGlass } from '../toon/sets.js';
const META = await (await fetch('/data/meta.json')).json();
const ENV = await (await fetch('/data/env.json')).json();
export const DUR = META.dur;
const TL = META.lines;                       // [spk,start,end] x8
let c, groups = [];
const KEYS = /^(bavan\.?|attaanve|IIT|startup|hazaar|crore|2019|zinda|neend|shaant|tension|seekh|percent\.?)$/i;
export function init(cx, w) { c = cx; bind(c); groups = groupWords(w) }
const env = (k, t) => { const a = ENV[k]; return a ? (a[Math.min(a.length - 1, Math.max(0, Math.floor(t * 30)))] || 0) : 0 };
const sm = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u) };
const seg = (t, a, b) => sm((t - a) / (b - a));
const nz = (t, k) => Math.sin(t * 17.3 + k) * .5 + Math.sin(t * 9.1 + k * 2) * .5;
const S = .86, HY = 1180, KX = 800, BX = 330, FLOOR = 1412, LEN = 146, LIFT = 205, SH = { near: [-70, -300], far: [78, -312] };
const BAT = { ...BATTERY };
// two-bone IK in the body frame -> {e,h} for a WORLD target (hy = hip y, flip = mirrored body)
function ik(X, flip, hy, side, tx, ty) {
  const lx = flip ? (X - tx) / S : (tx - X) / S, ly = (ty - hy) / S, s0 = SH[side];
  let rx = lx - s0[0], ry = ly - s0[1]; const d0 = Math.hypot(rx, ry) || 1, mx = 2 * LEN * .985; if (d0 > mx) { rx *= mx / d0; ry *= mx / d0 }
  const d = Math.hypot(rx, ry), hh = Math.sqrt(Math.max(0, LEN * LEN - d * d / 4)); let px = -ry / d, py = rx / d; if (py < 0) { px = -px; py = -py }
  return { e: [rx / 2 + px * hh, ry / 2 + py * hh], h: [rx, ry] };
}
const handW = (X, flip, hy, side, a) => [X + (flip ? -1 : 1) * S * (SH[side][0] + a.h[0]), hy + S * (SH[side][1] + a.h[1])];
// ---------- room (painted once, blurred like depth of field) ----------
const OX = 260;
function roomLayer() {
  return layer('room', 1600, 1920, () => {
    const g = ctx(); g.translate(OX, 0);
    g.fillStyle = '#E3AE7C'; g.fillRect(-260, 0, 1600, FLOOR);
    for (let x = -260; x < 1340; x += 80) { g.fillStyle = (x / 80 & 1) ? 'rgba(255,225,180,.28)' : 'rgba(150,80,40,.10)'; g.fillRect(x, 0, 40, FLOOR) }
    g.fillStyle = '#2F6E7E'; g.fillRect(-260, 1130, 1600, FLOOR - 1130); g.fillStyle = '#25596A'; g.fillRect(-260, 1130, 1600, 16);
    for (let y = FLOOR; y < 1920; y += 70) { g.fillStyle = (y / 70 & 1) ? '#C79B6B' : '#BE9060'; g.fillRect(-260, y, 1600, 70) }
    for (let x = -260; x < 1340; x += 190) { g.strokeStyle = 'rgba(80,40,10,.25)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, FLOOR); g.lineTo(x - 70, 1920); g.stroke() }
    g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(-260, FLOOR, 1600, 14);
    // doorway to the kitchen (right) with a warm light and a curtain
    g.fillStyle = '#4A2E20'; g.fillRect(900, 520, 260, FLOOR - 520); g.fillStyle = '#F5C77A'; g.fillRect(916, 540, 228, FLOOR - 560);
    g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(940, 560, 60, 800);
    g.fillStyle = '#8A3A2A'; for (let i = 0; i < 4; i++) g.fillRect(916 + i * 58, 540, 26, 300 + (i & 1) * 80);
    // wall decor: clock and a framed photo
    g.fillStyle = '#F4EFE6'; g.beginPath(); g.arc(560, 330, 76, 0, 7); g.fill(); g.lineWidth = 10; g.strokeStyle = '#5B3A24'; g.stroke();
    g.lineWidth = 5; g.strokeStyle = '#222'; g.beginPath(); g.moveTo(560, 330); g.lineTo(560, 280); g.moveTo(560, 330); g.lineTo(596, 346); g.stroke();
    g.fillStyle = '#6B4A30'; g.fillRect(660, 250, 170, 210); g.fillStyle = '#D9C9A8'; g.fillRect(676, 266, 138, 178); g.fillStyle = '#B3764E'; g.beginPath(); g.arc(745, 330, 36, 0, 7); g.fill(); g.fillStyle = '#5A3A7A'; g.fillRect(700, 372, 90, 60);
    // window wall (left): frame
    g.fillStyle = '#F6F1E8'; g.fillRect(0, 470, 330, 540);
    g.fillStyle = '#E8873A'; g.fillRect(-40, 440, 80, 640); g.fillRect(290, 440, 80, 640);
  });
}
// ---------- dynamic set pieces ----------
const SHARDS = Array.from({ length: 26 }, (_, i) => { const r = (n) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x) }; return { x: 70 + r(1) * 200, y: 520 + r(2) * 420, vx: 120 + r(3) * 520, vy: -260 + r(4) * 360, a: r(5) * 6, w: 24 + r(6) * 40, h: 14 + r(7) * 26 } });
function windowGlass(t) {
  const c0 = ctx();
  c0.save(); c0.beginPath(); c0.rect(20, 490, 290, 500); c0.clip();
  const sky = c0.createLinearGradient(0, 490, 0, 990); sky.addColorStop(0, '#9FD6F2'); sky.addColorStop(1, '#D9F0FA'); c0.fillStyle = sky; c0.fillRect(20, 490, 290, 500);
  fillEll(220, 600, 70, 26, 'rgba(255,255,255,.8)'); fillEll(120, 680, 54, 20, 'rgba(255,255,255,.7)');
  if (t < .6) { c0.fillStyle = 'rgba(255,255,255,.28)'; c0.fillRect(20, 490, 290, 500); line([[40, 960], [260, 520]], 8, 'rgba(255,255,255,.4)', false) }
  c0.restore();
  c0.lineWidth = 10; c0.strokeStyle = '#E6DED0'; c0.strokeRect(20, 490, 290, 500); c0.beginPath(); c0.moveTo(165, 490); c0.lineTo(165, 990); c0.stroke();
  if (t >= .6 && t < 1.7) for (const s of SHARDS) { const u = t - .6; const x = s.x + s.vx * u, y = s.y + s.vy * u + 1500 * u * u * .5; if (y > FLOOR + 40) continue; c0.save(); c0.translate(x, y); c0.rotate(s.a + u * 5); c0.globalAlpha = clamp(1.7 - t, 0, 1); c0.fillStyle = 'rgba(190,230,250,.85)'; c0.strokeStyle = 'rgba(255,255,255,.9)'; c0.lineWidth = 3; c0.beginPath(); c0.moveTo(-s.w / 2, s.h / 2); c0.lineTo(s.w / 2, 0); c0.lineTo(-s.w / 4, -s.h / 2); c0.closePath(); c0.fill(); c0.stroke(); c0.restore() }
  if (t >= 1.7) for (const s of SHARDS.slice(0, 10)) { const x = 240 + s.vx * .8 * (s.x % 7) / 7 + 80, y = FLOOR + 20 + (s.y % 60); c0.save(); c0.translate(x, y); c0.rotate(s.a); c0.fillStyle = 'rgba(190,230,250,.8)'; c0.beginPath(); c0.moveTo(-s.w / 2, 4); c0.lineTo(s.w / 2, 0); c0.lineTo(-s.w / 4, -8); c0.closePath(); c0.fill(); c0.restore() }
  if (t >= .55) { c0.save(); c0.fillStyle = '#E6DED0'; for (const [x, y, w, h] of [[20, 490, 36, 60], [20, 930, 44, 60], [274, 490, 36, 50], [270, 940, 40, 50]]) { c0.beginPath(); c0.moveTo(x, y); c0.lineTo(x + w, y + h * .3); c0.lineTo(x + w * .3, y + h); c0.closePath(); c0.fill() } c0.restore() }
}
function sofa() {
  const g = ctx();
  poly([[520, 1170], [520, 880], [1130, 880], [1130, 1170]], '#8E2B34', () => { fillPoly([[520, 1100], [1130, 1100], [1130, 1170], [520, 1170]], 'rgba(0,0,0,.18)'); for (const x of [560, 760, 960]) fillPoly([[x, 900], [x + 170, 900], [x + 170, 1060], [x, 1060]], 'rgba(255,255,255,.07)') }, 5);
  poly([[500, 1196], [500, 1390], [1150, 1390], [1150, 1196]], '#A7343E', () => { fillPoly([[500, 1330], [1150, 1330], [1150, 1390], [500, 1390]], 'rgba(0,0,0,.2)') }, 5);
  poly([[500, 1180], [500, 1210], [1150, 1210], [1150, 1180]], '#B93E48', () => fillPoly([[500, 1196], [1150, 1196], [1150, 1210], [500, 1210]], 'rgba(0,0,0,.14)'), 5);
  for (const x of [560, 1090]) { g.fillStyle = '#4A2E20'; g.fillRect(x, 1390, 24, 22) }
}
function sofaArm() { poly([[1020, 1010], [1020, 1394], [1170, 1394], [1170, 1010]], '#8E2B34', () => fillPoly([[1110, 1010], [1170, 1010], [1170, 1394], [1110, 1394]], 'rgba(0,0,0,.2)'), 5); ell(1095, 1010, 75, 26, '#A7343E', null, 5) }
// ---------- props ----------
function trophy(x, y, s, rot = 0) {
  const g = ctx(); g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  poly([[-26, 0], [26, 0], [20, -22], [-20, -22]], '#6B4A30', null, 4);
  poly([[-8, -22], [8, -22], [6, -60], [-6, -60]], '#E3B93A', null, 4);
  poly([[-44, -64], [44, -64], [34, -150], [-34, -150]], '#F2C94C', () => { fillPoly([[10, -64], [44, -64], [34, -150], [18, -150]], '#D9A92B'); fillEll(-16, -110, 6, 26, 'rgba(255,255,255,.7)') }, 5);
  ell(-52, -110, 16, 24, null, null, 6); ell(52, -110, 16, 24, null, null, 6); g.restore();
}
function chappal(x, y, rot, s = 1) {
  const g = ctx(); g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  poly([[-60, 0], [-52, -22], [10, -26], [56, -14], [66, 6], [50, 22], [-30, 24], [-58, 14]], '#2E86C1', () => fillPoly([[-60, 8], [66, 8], [50, 22], [-30, 24]], '#1F5F8A'), 5);
  line([[-14, -6], [18, -34], [30, -4]], 8, '#E8E8E8'); g.restore();
}
function coffeePole(x, y, t, sway = 0) {   // pole held in his hand: long stick, hook, coffee bag with a drip chamber
  const g = ctx(); g.save(); g.translate(x, y); g.rotate(sway);
  line([[0, 40], [0, -520]], 12, '#8A8F99'); line([[-34, -520], [34, -520]], 12, '#8A8F99');
  line([[0, -520], [0, -470]], 4, '#222', false);
  poly([[-46, -470], [46, -470], [58, -330], [0, -290], [-58, -330]], '#6A3F22', () => { fillPoly([[-58, -380], [58, -380], [58, -330], [0, -290], [-58, -330]], '#3B2314'); fillEll(-24, -430, 8, 30, 'rgba(255,255,255,.4)') }, 5);
  rrect(-10, -282, 20, 50, 6, '#EAF4FA', () => { const u = (t * 1.6) % 1; fillEll(0, -270 + u * 30, 4, 6, '#8A4B1E') }, 3);
  g.restore();
}
function dripTube(x0, y0, x1, y1) { line([[x0, y0], [x0 + 30, (y0 + y1) / 2 + 60], [x1, y1]], 5, '#BFE1F0') }
function phone(x, y, s, rot, t, ring) {
  const g = ctx(); g.save(); g.translate(x, y); g.rotate(rot + (ring ? Math.sin(t * 60) * .03 : 0)); g.scale(s, s);
  rrect(-170, -300, 340, 600, 44, '#17171B', null, 6); rrect(-150, -270, 300, 540, 28, '#2B1B3A', null, 3);
  fillEll(0, -130, 70, 70, '#B3764E'); fillEll(0, -170, 44, 44, '#3A2B22'); fillEll(0, -60, 100, 70, '#C94A7A');
  g.fillStyle = '#fff'; g.font = '800 60px Inter'; g.textAlign = 'center'; g.fillText('Mummy', 0, 50);
  fillEll(-80, 190, 44, 44, '#D83B3B'); fillEll(80, 190, 44, 44, '#2FBF5B'); g.restore();
}
// ---------- acting ----------
const SIPS = [[1.3, 2.7], [5.7, 7.0], [12.0, 13.1], [14.5, 15.8], [17.9, 18.5], [29.2, 29.85]];
const sipAmt = (t) => SIPS.reduce((m, [a, b]) => Math.max(m, seg(t, a, a + .35) * (1 - seg(t, b - .3, b))), 0);
const HIT = 5.28;
function kalu(t) {
  const sp = env('k', t) > .06 && TL.some(([s, a, b]) => s === 'k' && t >= a - .05 && t <= b);
  const sip = sipAmt(t), hx = KX - S * 6, hy = HY - S * 470;
  let f = { brow: -.15, look: [.9, 0], mouth: 'flat', wide: .3 };
  if (sp) f = { brow: -.2, look: [.9, 0], mouth: 'talk', open: clamp(env('k', t) * .8, .12, .42), wide: .16, wideNow: nz(t * 1.7, 1) * .1 };
  const since = t - HIT, hitK = since > 0 ? Math.exp(-since * 5) : 0;
  if (hitK > .05) f = { brow: -.5, look: [.9, 0], mouth: 'flat', wide: .3 };
  const rest = { ...ik(KX, true, HY, 'near', KX - 80, HY - 240), hand: 'fist' }, restF = { ...ik(KX, true, HY, 'far', KX - 70, HY - 220), hand: 'fist' };
  const mouthP = [hx - 62, hy + 78];
  const near = sip > 0 ? { ...ik(KX, true, HY, 'near', lerp(KX - 80, mouthP[0] - 8, sip), lerp(HY - 240, mouthP[1] + 18, sip)), hand: 'fist' } : rest;
  const tilt = -.03 * sip + (hitK > 0 ? Math.sin(since * 30) * .05 * hitK : 0) + Math.sin(t * 1.4) * .008;
  return { face: f, arms: { near, far: restF }, headTilt: tilt, lean: -.02 * sip, hatTilt: -.05 + (hitK > 0 ? .55 * hitK * Math.cos(since * 22) : 0), glass: { x: lerp(KX - 80, mouthP[0] - 8, sip) - 8, y: lerp(HY - 240, mouthP[1] + 18, sip) + 52, up: sip } };
}
function battery(t) {
  // 0-.9 flying in, .9-1.5 face-down on the floor, 1.5-2.3 rises like a zombie
  let x = BX, y = HY, rot = 0, st = 1, lean = 0, tilt = 0, nod = 0;
  const flying = t < .85, lying = t >= .85 && t < 1.5, rising = t >= 1.5 && t < 2.4;
  if (flying) { const u = t / .85, e = u * u; x = lerp(40, BX - 20, e); y = lerp(740, 1190, e) - Math.sin(u * Math.PI) * 120; rot = -u * 7.0; st = 0 }
  else if (lying) { const u = seg(t, .85, 1.0); x = BX - 130 + u * 0; y = 1346 - (1 - u) * 40; rot = Math.PI / 2 - .25 * 0; st = 0 }
  else if (rising) { const u = seg(t, 1.5, 2.4); x = BX - 130 * (1 - u); y = lerp(1346, HY, u); rot = (Math.PI / 2) * (1 - u); st = u; lean = Math.sin(u * 9) * .05 }
  const standing = t >= 2.4;
  const zomb = standing ? Math.sin(t * 2.1) * .02 : 0; lean += zomb; tilt = standing ? Math.sin(t * 1.3) * .025 + .04 : 0;
  const hy = HY - st * LIFT * S;
  const sp = TL.some(([s, a, b]) => s === 'b' && t >= a - .05 && t <= b);
  let f = { brow: .1, lid: .38, look: [.9, .15], mouth: 'flat', wide: .2 };
  if (t < 2.4) f = { brow: .6, browUp: 1, lid: 0, look: [.9, 0], eye: 1.15, mouth: 'o', open: .9 };
  else if (t < 9.3) f = { brow: .2, lid: .4, look: [.9, .15], mouth: 'flat', wide: .2 };
  else if (t < 16.2) { f = { brow: .25, lid: .38 + (Math.sin(t * 23) > .8 && t > 12 ? .25 : 0), look: [.92, .0], mouth: 'smile', wide: .26 }; if (sp) f = { ...f, mouth: 'talk', open: clamp(env('b', t) * 1.05, .2, .8), wide: .21, wideNow: nz(t * 1.7, 5) * .3 } }
  else if (t < 18.6) f = { brow: .5, lid: .25, look: [.9, .3], mouth: 'flat' };
  else if (t < 23.7) { f = { brow: .75, browUp: .5, lid: .1, look: [.7, .35], mouth: 'sad', tears: t > 20.5 }; tilt = .06 }
  else { f = { brow: .9, browUp: .6, lid: 0, look: [.8, .5], mouth: 'sad', tears: true }; if (sp) f = { ...f, mouth: 'talk', open: clamp(env('b', t) * 1.1, .2, .9), wide: .2, wideNow: nz(t * 1.7, 5) * .3 }; tilt = .08 + Math.sin(t * 14) * .02; lean += Math.sin(t * 11) * .015 }
  // arms: near holds the trophy at the chest; far holds the coffee pole
  const swing = flying ? { near: { e: [-60, -80], h: [-120, -190], hand: 'open' }, far: { e: [70, -90], h: [150, -200], hand: 'open' } } : null;
  const tT = t >= 24.55 && t < 99 ? 1 : 0;   // trophy slips at 'hazaar crore hain'
  const nearA = { ...ik(BX, false, hy, 'near', BX + 150, hy + 150 * S), hand: 'fist' };
  const farA = { ...ik(BX, false, hy, 'far', BX - 190, hy + 120 * S), hand: 'fist' };
  const arms = swing ? swing : { near: tT ? { e: [16, 150], h: [64, 270], hand: 'open' } : nearA, far: farA };
  return { x, y, rot, st, lean, nod, headTilt: tilt, face: f, arms, hy, standing };
}
// ---------- mom's arm from the kitchen doorway ----------
function momArm(t) {
  const m = env('m', t); const on = (t > .3 && t < 3.7) || (t > 5.6 && t < 9.3); if (!on) return;
  const g = ctx(), pull = t < 3.7 ? seg(t, .3, .6) * (1 - seg(t, 3.5, 3.7)) : seg(t, 5.6, 5.85) * (1 - seg(t, 9.1, 9.3));
  const sh = [1230, 780], wag = Math.sin(t * 19) * 14 * m, up = t > 5.6 ? 1 : 0;
  const el = [lerp(1230, 1070, pull) , 740 + wag * .3], hd = [lerp(1230, up ? 930 : 900, pull), (up ? 700 : 800) + wag * (up ? 2 : 1)];
  poly([[1150, 760], [1230, 760], [1270, 1180], [1130, 1200], [1100, 900]], '#E24A8B', () => { fillPoly([[1200, 760], [1230, 760], [1270, 1180], [1230, 1190]], 'rgba(0,0,0,.2)'); for (let i = 0; i < 6; i++) line([[1120 + i * 22, 840 + i * 50], [1230, 820 + i * 55]], 3, 'rgba(255,215,90,.55)', false) }, 5);
  tube(g, [sh, el, hd], [30, 25, 20], '#B3764E', { openStart: true });
  tube(g, [[sh[0] + 20, sh[1] - 4], lerp2(sh, el, .4)], [42, 36], '#2E8B8B', { openStart: true });
  for (let i = 0; i < 5; i++) { const p = lerp2(el, hd, .35 + i * .1); ell(p[0], p[1], 9, 17, null, null, 5, Math.atan2(hd[1] - el[1], hd[0] - el[0]) + 1.57); line([[p[0] - 9, p[1] - 1], [p[0] + 9, p[1] + 1]], 3, '#E7B73A') }
  fillEll(hd[0] - 4, hd[1], 28, 22, '#B3764E');
  if (!up) line([[hd[0] - 16, hd[1] - 3], [hd[0] - 90, hd[1] - 8]], 14, '#B3764E');   // pointing finger
  else { ell(hd[0] - 4, hd[1], 34, 28, '#B3764E', null, 5); for (const k of [-14, 0, 14]) line([[hd[0] - 30, hd[1] + k], [hd[0] - 18, hd[1] + k]], 3) }
}
const lerp2 = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
// ---------- camera ----------
function camera(t) {
  // [t0, z, cx, cy, shakeBase]
  const K = [[0, 1.3, 540, 1020], [3.8, 2.3, 800, 800], [5.62, 2.0, 980, 900], [7.4, 1.35, 560, 1050], [9.37, 2.05, 340, 700], [12.3, 4.6, 345, 640], [13.8, 1.3, 500, 1040], [16.45, 2.4, 800, 800], [18.57, 1.5, 540, 1000], [19.9, 2.5, 345, 660], [23.78, 3.2, 345, 650], [28.2, 2.4, 800, 800]];
  let i = 0; while (i + 1 < K.length && t >= K[i + 1][0]) i++;
  const k = K[i], u = clamp((t - k[0]) / ((K[i + 1] ? K[i + 1][0] : DUR) - k[0])), push = 1 + u * .07;
  let sh = 0; const d = t - .75; if (d > 0 && d < .6) sh = 22 * Math.exp(-d * 6); const d2 = t - HIT; if (d2 > 0 && d2 < .5) sh += 18 * Math.exp(-d2 * 7); if (t > 24.4 && t < 25.2) sh += 6;
  return { z: k[1] * push, cx: k[2] + Math.sin(t * 40) * sh * .5, cy: k[3] + Math.cos(t * 33) * sh };
}
// ---------- draw ----------
export function draw(t) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  const cm = camera(t);
  c.translate(W / 2, H / 2); c.scale(cm.z, cm.z); c.translate(-cm.cx, -cm.cy);
  const rl = roomLayer(), rb = blurred('roomB', rl, 5); c.drawImage(rb, -OX, 0);
  if (t > 9.3 && t < 16.3) { const a = seg(t, 9.3, 9.8) * (1 - seg(t, 15.8, 16.3)); const g = c.createLinearGradient(BX, 200, BX, FLOOR); g.addColorStop(0, `rgba(255,255,235,${.5 * a})`); g.addColorStop(1, `rgba(255,255,235,${.12 * a})`); c.fillStyle = g; c.beginPath(); c.moveTo(BX - 40, 200); c.lineTo(BX + 40, 200); c.lineTo(BX + 330, FLOOR); c.lineTo(BX - 330, FLOOR); c.closePath(); c.fill() }
  windowGlass(t);
  sofa();
  shadowBlob(KX - 40, FLOOR + 6, 300, 30, .25);
  const kst = kalu(t), bst = battery(t);
  // Kalu
  kpSeated({ ...KALU, x: KX, y: HY, s: S, flip: true, face: kst.face, arms: kst.arms, headTilt: kst.headTilt, lean: kst.lean, hatTilt: kst.hatTilt, turn: .55 });
  chaiGlass(kst.glass.x, kst.glass.y, 1.05, .85 - kst.glass.up * .25, kst.glass.up < .1 ? 1 : 0, t);
  const kh = kst.arms.near; const kw = handW(KX, true, HY, 'near', kh);
  fillEll(kw[0] + 6, kw[1] - 6, 6, 6, 'rgba(0,0,0,0)');
  // Battery (+ props)
  if (bst.st > .95 || t >= 2.4) shadowBlob(BX, FLOOR + 6, 130, 22, .28);
  c.save(); c.translate(bst.x, bst.y); c.rotate(bst.rot); c.translate(-bst.x, -bst.y);
  kpSeated({ ...BAT, x: bst.x, y: bst.y, s: S, stand: bst.st, face: bst.face, arms: bst.arms, headTilt: bst.headTilt, lean: bst.lean, turn: .55 });
  c.restore();
  if (bst.standing) {
    const hy = bst.hy, r = 128 * S, hx = BX + S * 6, hyd = hy - S * 470, fxo = .55 * 128 * .3 * S;
    // zombie dark circles under both eyes
    for (const sx of [-1, 1]) { c.save(); c.globalAlpha = .55; fillEll(hx + fxo + sx * r * .36, hyd + r * .27, r * .22, r * .075, '#5B3A78'); c.restore() }
    const hnd = handW(BX, false, hy, 'near', bst.arms.near), far = handW(BX, false, hy, 'far', bst.arms.far);
    if (t < 24.55) trophy(hnd[0] + 6, hnd[1] + 30, .8, .05); else { const u = t - 24.55; const fy = Math.min(FLOOR - 4, hnd[1] + 30 + 700 * u * u * 1.6); const bounce = fy >= FLOOR - 4 ? Math.abs(Math.sin((u - .55) * 6)) * 50 * Math.exp(-(u - .55) * 3) : 0; trophy(hnd[0] + 6 + u * 60, fy - bounce, .8, .05 + u * 3.2) }
    coffeePole(far[0] - 4, far[1] + 20, t, Math.sin(t * 2.4) * .02);
    dripTube(far[0] - 4 + 0, far[1] - 270, hnd[0] - 60, hnd[1] - 280);
  }
  // sparkle glint on the specs while smug
  if (t > 9.8 && t < 11.6) { const u = (t - 9.8) % .9; if (u < .3) { const k = Math.sin(u / .3 * Math.PI); c.save(); c.translate(BX + 60, HY - S * (470 + LIFT) - 8); c.rotate(.2); c.fillStyle = '#fff'; c.globalAlpha = k; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i & 1 ? 8 : 34 * k + 8; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) } c.closePath(); c.fill(); c.restore() } }
  // tears streaming
  if (t > 21 && bst.standing) for (let k = 0; k < 6; k++) { const ph = ((t * 1.7 + k * .37) % 1), sx = k & 1 ? 1 : -1, hx = BX + S * 6 + .55 * 128 * .3 * S + sx * 128 * S * .36; fillEll(hx + sx * 6 * ph, HY - S * (470 + LIFT) + 128 * S * .3 + ph * 120, 7, 12 + ph * 5, 'rgba(160,215,245,.85)') }
  sofaArm();
  momArm(t);
  // chappal flight (4.9 -> hit at 5.28 -> drops)
  if (t > 4.85 && t < 6.3) { let x, y, r; if (t < HIT) { const u = (t - 4.85) / (HIT - 4.85); x = lerp(1250, 800, u); y = lerp(840, 640, u) - Math.sin(u * Math.PI) * 60; r = u * 14 } else { const u = t - HIT; x = 800 - u * 160; y = 640 + 1700 * u * u * .5; r = 14 + u * 9; if (y > FLOOR) y = FLOOR - Math.abs(Math.sin((u - .75) * 7)) * 30 } chappal(x, y, r, 1.1) }
  // phone insert
  if (t >= 18.57 && t < 19.9) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = 'rgba(30,20,40,.82)'; c.fillRect(0, 0, W, H); c.restore(); phone(cm.cx, cm.cy + 20, 2.0, -.06, t, true); const e = env('bm', t); c.save(); c.globalAlpha = .5; c.strokeStyle = '#fff'; c.lineWidth = 8; for (let k = 1; k <= 3; k++) { c.beginPath(); c.arc(cm.cx, cm.cy - 150, 140 + k * 40 + e * 40 * k, -2.4, -.7); c.stroke() } c.restore() }
  c.restore();
  label([['Mom: "', '#111'], ['Sharma ji ka beta', '#D7261E'], ['..."', '#111']], W / 2, 150, 50);
  captions(groups, t, KEYS, 1690); finish(t);
}
export const cues = [];
