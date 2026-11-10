// 2026-11-10 YouTube "Rishta / sofa" (Kalu + his mom, Hinglish, spicy relatable). Based on ep-sharma.js. Originally: Sharma Ji v2 (clean, realistic, deadpan). Living room: Kalu (chill tee+shorts) and Battery (suit, black specs,
// dark circles) sit on the sofa watching TV. Kalu's mom stands full-body in the kitchen doorway scolding. Battery's phone rings (Mummy), he answers.
import { W, H, bind, ctx, lerp, clamp, label, captions, groupWords, finish, poly, ell, fillEll, fillPoly, line, rrect, layer, blurred, shadowBlob } from '../toon/toon.js';
import { kpSeated } from '../toon/kp.js';
import { KALU_CHILL } from '../toon/kalu.js';
import { chaiGlass } from '../toon/sets.js';
const META = await (await fetch('/data/meta.json')).json();
const ENV = await (await fetch('/data/env.json')).json();
export const DUR = META.dur;
const TL = META.lines;
let c, groups = [];
const KEYS = /^(rishta|kamayi|kamata|sofe|sofa|main\.?|accha\.?|kab\?)$/i;
export function init(cx, w) { c = cx; bind(c); groups = groupWords(w) }
const env = (k, t) => { const a = ENV[k]; return a ? (a[Math.min(a.length - 1, Math.max(0, Math.floor(t * 30)))] || 0) : 0 };
const sm = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u) };
const seg = (t, a, b) => sm((t - a) / (b - a));
const nz = (t, k) => Math.sin(t * 17.3 + k) * .5 + Math.sin(t * 9.1 + k * 2) * .5;
const speaking = (sp, t) => TL.some(([s, a, b]) => s === sp && t >= a - .05 && t <= b);
const S = .86, HY = 1180, LIFT = 205, FLOOR = 1412, LEN = 146, SH = { near: [-70, -300], far: [78, -312] };
const KX = 520, MX = 1075, SL = 250, SR = 820;
const KAL = { ...KALU_CHILL, sun: true, hair: 'kaluSq', hairCol: '#1B1411' };
const MOM = { skin: '#B3764E', hair: 'mane', hairCol: '#2B1D18', top: 'tee', topCol: '#D9467F', pant: '#C23A70', shoe: '#6B4A32' };
function ik(X, flip, hy, side, tx, ty) {
  const lx = flip ? (X - tx) / S : (tx - X) / S, ly = (ty - hy) / S, s0 = SH[side];
  let rx = lx - s0[0], ry = ly - s0[1]; const d0 = Math.hypot(rx, ry) || 1, mx = 2 * LEN * .985; if (d0 > mx) { rx *= mx / d0; ry *= mx / d0 }
  const d = Math.hypot(rx, ry), hh = Math.sqrt(Math.max(0, LEN * LEN - d * d / 4)); let px = -ry / d, py = rx / d; if (py < 0) { px = -px; py = -py }
  return { e: [rx / 2 + px * hh, ry / 2 + py * hh], h: [rx, ry] };
}
const handW = (X, flip, hy, side, a) => [X + (flip ? -1 : 1) * S * (SH[side][0] + a.h[0]), hy + S * (SH[side][1] + a.h[1])];
const OX = 260;
function roomLayer() {
  return layer('room', 1700, 1920, () => {
    const g = ctx(); g.translate(OX, 0);
    g.fillStyle = '#E3AE7C'; g.fillRect(-260, 0, 1700, FLOOR);
    for (let x = -260; x < 1440; x += 80) { g.fillStyle = (x / 80 & 1) ? 'rgba(255,225,180,.28)' : 'rgba(150,80,40,.10)'; g.fillRect(x, 0, 40, FLOOR) }
    g.fillStyle = '#2F6E7E'; g.fillRect(-260, 1130, 1700, FLOOR - 1130); g.fillStyle = '#25596A'; g.fillRect(-260, 1130, 1700, 16);
    for (let y = FLOOR; y < 1920; y += 70) { g.fillStyle = (y / 70 & 1) ? '#C79B6B' : '#BE9060'; g.fillRect(-260, y, 1700, 70) }
    for (let x = -260; x < 1440; x += 190) { g.strokeStyle = 'rgba(80,40,10,.25)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, FLOOR); g.lineTo(x - 70, 1920); g.stroke() }
    g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(-260, FLOOR, 1700, 14);
    // doorway to the kitchen (right), warm light
    g.fillStyle = '#4A2E20'; g.fillRect(930, 480, 300, FLOOR - 480); g.fillStyle = '#F5C77A'; g.fillRect(948, 500, 264, FLOOR - 520);
    g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(975, 520, 60, 820);
    // wall: clock + framed photo
    g.fillStyle = '#F4EFE6'; g.beginPath(); g.arc(520, 320, 72, 0, 7); g.fill(); g.lineWidth = 10; g.strokeStyle = '#5B3A24'; g.stroke();
    g.lineWidth = 5; g.strokeStyle = '#222'; g.beginPath(); g.moveTo(520, 320); g.lineTo(520, 272); g.moveTo(520, 320); g.lineTo(554, 336); g.stroke();
    g.fillStyle = '#6B4A30'; g.fillRect(650, 250, 170, 200); g.fillStyle = '#D9C9A8'; g.fillRect(666, 266, 138, 168); g.fillStyle = '#B3764E'; g.beginPath(); g.arc(735, 326, 34, 0, 7); g.fill(); g.fillStyle = '#5A3A7A'; g.fillRect(692, 366, 86, 56);
    // TV on a stand (what they are watching)
    g.fillStyle = '#7A4A2C'; g.fillRect(-120, 1020, 320, 110); g.fillStyle = '#16181C'; g.fillRect(-140, 640, 360, 250); const sg = g.createLinearGradient(-130, 650, 210, 880); sg.addColorStop(0, '#3E6C8F'); sg.addColorStop(1, '#27425A'); g.fillStyle = sg; g.fillRect(-128, 652, 336, 226); g.fillStyle = '#16181C'; g.fillRect(10, 890, 40, 130);
  });
}
function sofa() {
  poly([[SL, 1170], [SL, 880], [SR, 880], [SR, 1170]], '#8E2B34', () => { fillPoly([[SL, 1100], [SR, 1100], [SR, 1170], [SL, 1170]], 'rgba(0,0,0,.18)'); for (let x = SL + 40; x < SR - 100; x += 200) fillPoly([[x, 900], [x + 170, 900], [x + 170, 1060], [x, 1060]], 'rgba(255,255,255,.07)') }, 5);
  poly([[SL - 20, 1196], [SL - 20, 1390], [SR + 20, 1390], [SR + 20, 1196]], '#A7343E', () => fillPoly([[SL - 20, 1330], [SR + 20, 1330], [SR + 20, 1390], [SL - 20, 1390]], 'rgba(0,0,0,.2)'), 5);
  poly([[SL - 20, 1180], [SL - 20, 1210], [SR + 20, 1210], [SR + 20, 1180]], '#B93E48', () => fillPoly([[SL - 20, 1196], [SR + 20, 1196], [SR + 20, 1210], [SL - 20, 1210]], 'rgba(0,0,0,.14)'), 5);
}
function phone(x, y, s, rot, ring, t, lit) {
  const g = ctx(); g.save(); g.translate(x, y); g.rotate(rot + (ring ? Math.sin(t * 70) * .05 : 0)); g.scale(s, s);
  rrect(-60, -105, 120, 210, 18, '#17171B', null, 4);
  if (lit) { rrect(-52, -92, 104, 184, 12, '#2B1B3A', null, 2); fillEll(0, -40, 20, 20, '#C94A7A'); g.fillStyle = '#fff'; g.font = '800 26px Inter'; g.textAlign = 'center'; g.fillText('Mummy', 0, 20); fillEll(-26, 66, 14, 14, '#D83B3B'); fillEll(26, 66, 14, 14, '#2FBF5B') }
  else rrect(-52, -92, 104, 184, 12, '#0E0E12', null, 2);
  g.restore();
}
const SIPS = [[0.8, 2.0], [6.9, 7.1]];
const sipAmt = (t) => SIPS.reduce((m, [a, b]) => Math.max(m, seg(t, a, a + .4) * (1 - seg(t, b - .35, b))), 0);
function kalu(t) {
  const sp = speaking('k', t), sip = sipAmt(t);
  let f = { brow: -.1, look: [.9, 0], mouth: 'flat', wide: .3 };
  if (sp) f = { brow: -.1, look: [.9, 0], mouth: 'talk', open: clamp(env('k', t) * .6, .1, .3), wide: .14, wideNow: nz(t * 1.2, 1) * .06 };
  const rest = { ...ik(KX, false, HY, 'near', KX + 80, HY - 240), hand: 'fist' }, restF = { ...ik(KX, false, HY, 'far', KX + 70, HY - 220), hand: 'fist' };
  const mouthP = [KX + S * 6 + 62, HY - S * 470 + 78];
  const gx = lerp(KX + 80, mouthP[0] + 8, sip), gy = lerp(HY - 240, mouthP[1] + 18, sip);
  const near = sip > 0 ? { ...ik(KX, false, HY, 'near', gx, gy), hand: 'fist' } : rest;
  const last = TL[7][1]; const nod = t > last ? Math.sin(clamp((t - last) / .4, 0, 1) * Math.PI) * .3 : 0;
  return { face: f, arms: { near, far: restF }, headTilt: Math.sin(t * 1.4) * .008 - .03 * sip, nod, glass: { x: gx + 8, y: gy + 52, up: sip } };
}
function mom(t) {
  const sp = speaking('m', t), m = env('m', t), hy = HY - LIFT * S;
  let f = { brow: -.2, look: [.8, .05], mouth: 'flat', wide: .25 };
  if (sp) f = { brow: -.25, look: [.8, .05], mouth: 'talk', open: clamp(m * .9, .15, .65), wide: .22, wideNow: nz(t * 1.7, 3) * .2 };
  const pointing = speaking('m', t) && !(t >= TL[6][1] - .05);
  const wag = pointing ? Math.sin(t * 8) * 12 * m : 0;
  const query = t >= TL[6][1] - .05 && t < TL[6][2] + .3;
  const near = pointing ? { ...ik(MX, true, hy, 'near', MX - 215, hy - 40 + wag), hand: 'point' } : query ? { ...ik(MX, true, hy, 'near', MX - 190, hy + 40), hand: 'open' } : { ...ik(MX, true, hy, 'near', MX - 70, hy + 200), hand: 'fist' };
  const far = { ...ik(MX, true, hy, 'far', MX - 94, hy - 120), hand: 'fist' };   // hand on hip
  return { face: f, arms: { near, far }, hy, headTilt: pointing ? -.03 + Math.sin(t * 6) * .02 * m : 0 };
}
function camera(t) {
  const S0 = (i) => TL[i][1] - .12;
  const K = [[0, 1.0, 700, 1000], [S0(1), 2.0, 540, 800], [S0(2), 1.8, 1010, 820], [S0(3), 2.0, 540, 800], [S0(4), 1.8, 1010, 820], [S0(5), 2.1, 540, 800], [S0(6), 1.0, 700, 1000], [S0(7), 2.3, 540, 790]];
  let i = 0; while (i + 1 < K.length && t >= K[i + 1][0]) i++;
  const k = K[i], u = clamp((t - k[0]) / ((K[i + 1] ? K[i + 1][0] : DUR) - k[0])), push = 1 + u * .05;
  return { z: k[1] * push, cx: k[2], cy: k[3] };
}
export function draw(t) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  const cm = camera(t);
  c.translate(W / 2, H / 2); c.scale(cm.z, cm.z); c.translate(-cm.cx, -cm.cy);
  c.drawImage(blurred('roomB', roomLayer(), 5), -OX, 0);
  sofa();
  shadowBlob(KX + 40, FLOOR + 6, 260, 26, .22); shadowBlob(MX - 10, FLOOR + 6, 140, 22, .25);
  // mom (standing, full body, behind the sofa end, in the doorway)
  const ms = mom(t);
  kpSeated({ ...MOM, x: MX, y: HY, s: S, flip: true, stand: 1, face: ms.face, arms: ms.arms, headTilt: ms.headTilt, turn: .55 });
  { const hx = MX - S * 6, hy = ms.hy - S * 470; fillEll(hx - 62 * S + 3, hy - 54, 6, 6, '#B3262E');                       // bindi
    line([[MX + 40, ms.hy - S * 330], [MX - 40, ms.hy - S * 90]], 20, '#F0C14B') }                                       // saree border over the shoulder
  // Kalu on the sofa, facing his mom
  const kst = kalu(t);
  kpSeated({ ...KAL, x: KX, y: HY, s: S, flip: false, face: kst.face, arms: kst.arms, headTilt: kst.headTilt, nod: kst.nod, turn: .55 });
  chaiGlass(kst.glass.x, kst.glass.y, 1.05, .85 - kst.glass.up * .25, kst.glass.up < .1 ? 1 : 0, t);
  c.restore();
  captions(groups, t, KEYS, 1690); finish(t);
}
export const cues = [];
