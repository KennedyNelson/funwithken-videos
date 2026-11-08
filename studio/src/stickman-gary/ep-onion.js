// 2026-11-08 YouTube "Your Onion Has a Chemical Weapon" (type 1 funny knowledge). Style: POLISHED DESI TOON, cel-lit desi kitchen.
// Beats: A villain onion macro | B wide kitchen push to Papa | C Papa smug CU + over-the-onion | D CHOP punch-in | E cells burst macro |
// F two chemicals mix -> gas | G gas floats to Papa, eye CU floods | H Papa sobbing denial, onion innocent | I fridge chill | J sharp knife |
// K happy chopping | L Mom's hand drops a sack | M Papa's face freezes, one tear | N sack of smirking onions (loops to A).
import { W, H, bind, ctx, lerp, clamp, ease, easeOut, back, pr, captions, groupWords, finish, fillEll, fillPoly, poly, ell, blob, line, rrect, dark, light, layer, blurred, shadowBlob, stroke } from '../toon/toon.js';
import { person } from '../toon/people.js';
const META = await (await fetch('/data/meta.json')).json();
const ENV = await (await fetch('/data/env.json')).json();
export const DUR = META.dur;
const S = META.starts, E = META.ends;
let c, groups = [];
const KEYS = /^(weapon\.?|Papa\.?|CHOP!|cells\.?|gas\.?|tears|NOT|chill|sharp|five|kilos\.*|wedding\.?|weddings\.?)$/i;
export function init(cx, w) { c = cx; bind(c); groups = groupWords(w) }
const env = (k, t) => { const a = ENV[k]; if (!a) return 0; return a[Math.min(a.length - 1, Math.max(0, Math.floor(t * 30)))] || 0 };
const talk = (k, t, base = 'smile', big = 'open') => { const a = env(k, t); return a > .1 ? { mouth: big, open: clamp(a * 1.4, .3, 1) } : { mouth: base } };
const blink = (t, ph = 0) => ((t + ph) % 3.1) < .12 ? .95 : 0;
const cam = (z, x, y, sh, t, fn) => { c.save(); const dx = sh ? Math.sin(t * 61) * sh : 0, dy = sh ? Math.cos(t * 83) * sh : 0; c.translate(W / 2 + dx, H / 2 + dy); c.scale(z, z); c.translate(-x, -y); fn(); c.restore() };
const OUT = '#2B1D16';
// ---------- cast ----------
const PAPA = { skin: '#B07850', vest: true, hair: 'sidepart', hairCol: '#3d3a38', stache: true, belly: true, specs: true, gamcha: '#2F8F6A', browCol: '#3d3a38' };
const DX = 560, DY = 1900, DS = 1.1;
const EYE_Y = DY - 670 * DS, FACE_Y = DY - 704 * DS;
function armTo(p, q, wx, wy, droop = 50, prop) {
  const s = p.s || 1, fl = p.flip ? -1 : 1, lx = (wx - p.x) / s * fl, ly = (wy - p.y) / s;
  const sx = q * 96, sy = -490; let hx = lx - sx, hy = ly - sy; const L = Math.hypot(hx, hy), M = 230; if (L > M) { hx *= M / L; hy *= M / L }
  return [hx * .5 + q * 18, hy * .5 + droop, hx, hy, prop];
}
// ---------- props ----------
function knife(x, y, rot = 0, s = 1, shine = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  poly([[-20, -26], [70, -26], [70, 26], [-20, 26]], '#2a2220', () => fillPoly([[-20, 10], [70, 10], [70, 26], [-20, 26]], '#151010'), 4);
  for (const k of [0, 30]) fillEll(k + 10, 0, 5, 5, '#C9D3DC');
  poly([[-20, -30], [-250, -30], ['q', -300, -26, -320, 18], [-20, 18]], '#D7DEE5', () => { fillPoly([[-330, 4], [-20, 4], [-20, 22], [-330, 22]], '#AEB8C2'); fillPoly([[-240, -24], [-60, -24], [-60, -14], [-240, -14]], '#F4F8FB') }, 4);
  if (shine > 0) { const sx = lerp(-300, -40, shine); c.save(); c.globalAlpha = .9 * Math.sin(shine * Math.PI); c.beginPath(); c.moveTo(-320, 18); c.lineTo(-250, -30); c.lineTo(-20, -30); c.lineTo(-20, 18); c.closePath(); c.clip(); fillPoly([[sx - 30, -40], [sx + 10, -40], [sx - 10, 30], [sx - 50, 30]], '#FFFFFF'); c.restore() }
  c.restore();
}
function sparkle(x, y, r, a = 1) { c.save(); c.globalAlpha = a; c.translate(x, y); fillPoly([[0, -r], [r * .18, -r * .18], [r, 0], [r * .18, r * .18], [0, r], [-r * .18, r * .18], [-r, 0], [-r * .18, -r * .18]], '#FFFFFF'); c.restore() }
// the onion: red/pink desi onion with a face. o: brow (+ = villain), mouth, lid, look, eye, half (gap), cold, shiver
const ON = '#A8336B';
function onionBody(r) {
  c.moveTo(0, -r * 1.25);
  c.bezierCurveTo(r * .18, -r * .9, r * 1.05, -r * .75, r * 1.02, -r * .05);
  c.bezierCurveTo(r * 1.0, r * .6, r * .5, r * .9, 0, r * .9);
  c.bezierCurveTo(-r * .5, r * .9, -r * 1.0, r * .6, -r * 1.02, -r * .05);
  c.bezierCurveTo(-r * 1.05, -r * .75, -r * .18, -r * .9, 0, -r * 1.25); c.closePath();
}
function onionShell(r, col) {
  c.beginPath(); onionBody(r); c.fillStyle = col; c.fill();
  c.save(); c.beginPath(); onionBody(r); c.clip();
  fillEll(r * .55, r * .2, r * .6, r * 1.1, dark(col, .2));
  for (const k of [-.55, -.2, .2, .55]) { c.beginPath(); c.moveTo(0, -r * 1.2); c.quadraticCurveTo(k * r * 1.9, -r * .1, k * r * .6, r * .9); c.lineWidth = r * .05; c.strokeStyle = light(col, .28); c.stroke() }
  fillEll(-r * .45, -r * .35, r * .16, r * .34, 'rgba(255,255,255,.45)', -.3);
  c.restore();
  c.beginPath(); onionBody(r); stroke(Math.max(3, r * .07));
}
function onionFace(r, o, t) {
  const look = o.look || [0, 0], eR = r * .2 * (o.eye || 1), lid = clamp(o.lid || 0), b = o.brow || 0, ey = -r * .12;
  for (const q of [-1, 1]) {
    const X = q * r * .34;
    ell(X, ey, eR, eR * 1.15, '#FFFFFF', null, Math.max(2.5, r * .045));
    const px = X + look[0] * eR * .4, py = ey + look[1] * eR * .4;
    c.save(); c.beginPath(); c.ellipse(X, ey, eR, eR * 1.15, 0, 0, 7); c.clip();
    fillEll(px, py, eR * .5, eR * .55, '#1a0d12'); fillEll(px - eR * .18, py - eR * .2, eR * .16, eR * .16, '#FFFFFF');
    if (lid > 0) { c.fillStyle = ON; c.fillRect(X - eR - 2, ey - eR * 1.2, eR * 2 + 4, eR * 2.3 * lid) }
    c.restore();
    if (lid > 0) line([[X - eR, ey - eR * 1.15 + eR * 2.3 * lid], [X + eR, ey - eR * 1.15 + eR * 2.3 * lid]], Math.max(2.5, r * .05), OUT, false);
    // brows: villain = inner end down
    const by = ey - eR * 1.5; line([[X - q * eR * 1.1, by + b * eR * .7], [X + q * eR * 1.1, by - b * eR * .5]], Math.max(4, r * .1), '#2a0e1c', false);
  }
  const m = o.mouth || 'smirk', my = r * .36, w = r * .32;
  if (m === 'smirk') { c.beginPath(); c.moveTo(-w, my - r * .02); c.quadraticCurveTo(0, my + r * .14, w * 1.1, my - r * .16); stroke(Math.max(3, r * .06)) }
  else if (m === 'grin') poly([[-w, my - r * .06], [w, my - r * .1], ['q', w * .8, my + r * .22, 0, my + r * .2], ['q', -w * .8, my + r * .2, -w, my - r * .06]], '#FFFFFF', () => fillPoly([[-w, my + r * .05], [w, my + r * .05], [w, my + r * .08], [-w, my + r * .08]], '#ddd'), Math.max(3, r * .05));
  else if (m === 'ouch' || m === 'open') ell(0, my + r * .04, w * .6, r * .16 * (m === 'ouch' ? 1 : .7), '#5A1414', () => fillEll(0, my + r * .14, w * .4, r * .07, '#E0605F'), Math.max(3, r * .05));
  else if (m === 'innocent') { ell(0, my, r * .08, r * .08, '#5A1414', null, Math.max(2.5, r * .04)) }
  else if (m === 'sad') { c.beginPath(); c.moveTo(-w * .8, my + r * .08); c.quadraticCurveTo(0, my - r * .1, w * .8, my + r * .08); stroke(Math.max(3, r * .06)) }
  else if (m === 'chatter') { const k = Math.sin(t * 60) > 0 ? 1 : 0; poly([[-w, my - r * .06], [w, my - r * .06], [w, my + r * .06 + k * r * .05], [-w, my + r * .06 + k * r * .05]], '#FFFFFF', () => { for (let i = -2; i <= 2; i++) line([[i * w * .4, my - r * .06], [i * w * .4, my + r * .12]], 2, '#aaa', false) }, Math.max(3, r * .05)) }
}
function onion(x, y, r, o = {}, t = 0) {
  c.save(); c.translate(x + (o.shiver ? Math.sin(t * 70) * r * .04 : 0), y - (o.hop || 0)); c.rotate(o.rot || 0);
  if (!o.noShadow) shadowBlob(0, r * .92, r * .9, r * .14, .25);
  // roots
  for (let i = -2; i <= 2; i++) line([[i * r * .08, r * .86], [i * r * .14, r * 1.02], [i * r * .2 + Math.sin(i) * r * .05, r * 1.06]], Math.max(2, r * .03), '#C9A87A');
  const col = o.cold ? mixCol(ON, '#9FB8E8', o.cold * .45) : ON;
  if (o.half) {
    const g = o.half;
    for (const q of [-1, 1]) {
      c.save(); c.translate(q * g, 0); c.rotate(q * g * .004);
      c.save(); c.beginPath(); c.rect(q < 0 ? -r * 1.2 : 0, -r * 1.4, r * 1.2, r * 2.6); c.clip(); onionShell(r, col); c.restore();
      // cut face
      c.save(); c.beginPath(); c.moveTo(0, -r * 1.22); c.bezierCurveTo(q * r * .2, -r * .6, q * r * .22, r * .4, 0, r * .9); c.closePath(); c.fillStyle = '#F6E6EE'; c.fill();
      for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(0, -r * 1.2 + k * r * .18); c.bezierCurveTo(q * r * .16 * (1 - k * .2), -r * .5, q * r * .16 * (1 - k * .2), r * .3, 0, r * .9 - k * r * .1); c.lineWidth = 2; c.strokeStyle = '#D9A2BE'; c.stroke() }
      c.beginPath(); c.moveTo(0, -r * 1.22); c.bezierCurveTo(q * r * .2, -r * .6, q * r * .22, r * .4, 0, r * .9); stroke(Math.max(3, r * .05)); c.restore();
      c.restore();
    }
    c.save(); c.translate(-g - r * .42, 0); c.scale(.62, .62); onionFace(r, o, t); c.restore();
  } else {
    onionShell(r, col);
    // dry neck
    poly([[-r * .1, -r * 1.2], [-r * .04, -r * 1.55], [r * .06, -r * 1.6], [r * .1, -r * 1.2]], '#D8B884', null, Math.max(2.5, r * .04));
    onionFace(r, o, t);
  }
  if (o.cold) { c.save(); c.globalAlpha = o.cold; for (let i = -3; i <= 3; i++) poly([[i * r * .25 - r * .06, -r * .8 + Math.abs(i) * r * .1], [i * r * .25 + r * .06, -r * .8 + Math.abs(i) * r * .1], [i * r * .25, -r * .5 + Math.abs(i) * r * .1]], '#E8F6FF', null, 2); c.restore() }
  if (o.sweat) { poly([[r * .9, -r * .6], ['q', r * 1.1, -r * .3, r * .9, -r * .2], ['q', r * .7, -r * .3, r * .9, -r * .6]], '#9ED8F5', null, 3) }
  c.restore();
}
function mixCol(a, b, u) { const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const A = h(a), B = h(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], u)).toString(16).padStart(2, '0')).join('') }
// the gas: a sly pale cloud with a face
function gas(x, y, s, a = 1, t = 0, face = 'sly') {
  c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha = a;
  const P = [[0, 0, 70], [-60, 14, 50], [60, 12, 52], [-28, -40, 46], [34, -38, 44], [0, 40, 44]];
  for (const [px, py, r] of P) fillEll(px + Math.sin(t * 3 + px) * 4, py + Math.cos(t * 3 + py) * 4, r + 8, r + 8, OUT);
  for (const [px, py, r] of P) fillEll(px + Math.sin(t * 3 + px) * 4, py + Math.cos(t * 3 + py) * 4, r, r, '#DDF28C');
  fillEll(-30, -36, 26, 14, 'rgba(255,255,255,.55)');
  if (face === 'sly') {
    for (const q of [-1, 1]) { ell(q * 24, -4, 13, 15, '#FFFFFF', () => { fillEll(q * 24 + 4, -2, 7, 8, '#1a1a10'); c.fillStyle = '#DDF28C'; c.fillRect(q * 24 - 14, -20, 28, 12) }, 3); line([[q * 24 - q * 14, -26 + 8], [q * 24 + q * 14, -26 - 4]], 5, '#2a3010', false) }
    c.beginPath(); c.moveTo(-24, 24); c.quadraticCurveTo(4, 44, 30, 18); stroke(5);
  } else { for (const q of [-1, 1]) line([[q * 24 - 10, -2], [q * 24 + 10, -2]], 5); c.beginPath(); c.moveTo(-14, 28); c.quadraticCurveTo(0, 18, 14, 28); stroke(5) }
  c.restore();
}
// tears: streams from Papa's eyes (world coords), k = strength 0..1, fountain = arcs
function tears(t, k, fountain = 0, cx = DX, ey = EYE_Y) {
  if (k <= 0) return;
  for (const q of [-1, 1]) {
    const x = cx + q * 45 * DS, y = ey + 28 * DS;
    c.save(); c.globalAlpha = .9;
    poly([[x - 9, y], [x + 9, y], [x + 12 + q * 6, y + 150 * k], [x - 12 + q * 6, y + 150 * k]], '#7CCBF2', () => fillPoly([[x - 3, y], [x + 1, y], [x + 1, y + 150 * k], [x - 3, y + 150 * k]], '#D4F0FF'), 3);
    if (fountain > 0) for (let i = 0; i < 9; i++) { const ph = ((t * 2.2 + i / 9) % 1), dx = q * ph * 300 * fountain, dy = -110 * fountain * Math.sin(ph * Math.PI) + ph * ph * 260; fillEll(x + dx, y + dy, 12 - ph * 4, 15 - ph * 4, '#7CCBF2'); fillEll(x + dx - 3, y + dy - 4, 4, 4, '#FFFFFF') }
    c.restore();
  }
}
// ---------- kitchen (static layers) ----------
const CTOP = 1560;
function kitchenBack() {
  return layer('kback', 1880, 1920, () => {
    const c = ctx(); c.save(); c.translate(400, 0);
    // wall
    const g = c.createLinearGradient(0, 0, 0, 1150); g.addColorStop(0, '#F7E6BC'); g.addColorStop(1, '#F1D9A4'); c.fillStyle = g; c.fillRect(-400, 0, 1880, 1160);
    // window with sky + tree + curtains
    poly([[70, 280], [450, 280], [450, 780], [70, 780]], '#FFFFFF', null, 6);
    const sk = c.createLinearGradient(0, 300, 0, 760); sk.addColorStop(0, '#7EC8F2'); sk.addColorStop(1, '#D9F0FA'); c.fillStyle = sk; c.fillRect(92, 302, 336, 456);
    for (const [x, y, r] of [[160, 680, 90], [250, 640, 110], [360, 690, 90]]) ell(x, y, r, r * .8, '#5DB35E', () => fillEll(x + 30, y + 30, r * .7, r * .5, '#4A9A4E'), 4);
    for (const [x, y] of [[170, 400], [330, 360]]) { fillEll(x, y, 46, 22, '#FFFFFF'); fillEll(x + 34, y - 10, 36, 22, '#FFFFFF') }
    line([[260, 302], [260, 758]], 10, '#FFFFFF', false); line([[92, 530], [428, 530]], 10, '#FFFFFF', false);
    poly([[60, 800], [460, 800], [470, 822], [50, 822]], '#E9E2D2', null, 4);
    for (const q of [0, 1]) { const x0 = q ? 400 : 20; poly([[x0, 250], [x0 + 100, 250], ['q', x0 + 110 - q * 60, 560, x0 + 90 - q * 30, 840], [x0 + 10, 840]], '#F08A3C', () => { for (let i = 0; i < 9; i++) { fillEll(x0 + 30 + (i % 2) * 40, 300 + i * 62, 12, 12, '#FFD25A'); fillEll(x0 + 30 + (i % 2) * 40, 300 + i * 62, 5, 5, '#C9302C') } fillPoly([[x0 + 60, 250], [x0 + 100, 250], [x0 + 100, 840], [x0 + 70, 840]], 'rgba(0,0,0,.12)') }, 4) }
    line([[0, 250], [520, 250]], 12, '#8B5A2B', false);
    // sun beam across the wall
    c.save(); c.globalAlpha = .16; fillPoly([[100, 300], [450, 300], [900, 1150], [420, 1150]], '#FFFFFF'); c.restore();
    // shelf with steel dabbas
    poly([[600, 640], [1060, 640], [1060, 664], [600, 664]], '#8B5A2B', () => fillPoly([[600, 654], [1060, 654], [1060, 664], [600, 664]], '#6b4420'), 4);
    for (let i = 0; i < 5; i++) { const x = 625 + i * 86, h = 110 + (i % 2) * 40; poly([[x, 640], [x, 640 - h], [x + 70, 640 - h], [x + 70, 640]], '#C9D3DC', () => { fillPoly([[x + 44, 640 - h], [x + 70, 640 - h], [x + 70, 640], [x + 44, 640]], '#9AA6B0'); fillPoly([[x + 10, 640 - h], [x + 22, 640 - h], [x + 22, 640], [x + 10, 640]], '#EEF3F7') }, 4); ell(x + 35, 640 - h, 37, 9, '#B7C2CB', null, 3) }
    // ladle rail
    line([[640, 860], [1040, 860]], 8, '#9AA6B0', false);
    for (let i = 0; i < 4; i++) { const x = 680 + i * 100; line([[x, 860], [x, 1010]], 7, '#AEB8C2', false); ell(x, 1030, i % 2 ? 28 : 22, 20, '#C9D3DC', () => fillEll(x + 8, 1036, 14, 10, '#9AA6B0'), 4) }
    // backsplash tiles
    c.fillStyle = '#FBFBF7'; c.fillRect(-400, 1150, 1880, 420);
    c.fillStyle = '#3FA3B5'; c.fillRect(-400, 1150, 1880, 64); for (let x = -400; x < 1480; x += 64) { c.fillStyle = '#F2C14E'; c.beginPath(); c.arc(x + 32, 1182, 12, 0, 7); c.fill() }
    c.strokeStyle = '#E1DED4'; c.lineWidth = 3; for (let x = -400; x < 1480; x += 80) { c.beginPath(); c.moveTo(x, 1214); c.lineTo(x, 1560); c.stroke() } for (let y = 1214; y < 1560; y += 80) { c.beginPath(); c.moveTo(-400, y); c.lineTo(1480, y); c.stroke() }
    line([[-400, 1150], [1480, 1150]], 4, OUT, false);
    // gas stove + pressure cooker (right)
    poly([[720, 1480], [1060, 1480], [1060, 1550], [720, 1550]], '#2E2E2E', () => fillPoly([[720, 1530], [1060, 1530], [1060, 1550], [720, 1550]], '#1a1a1a'), 4);
    for (const kx of [770, 830]) ell(kx, 1516, 14, 14, '#9AA6B0', null, 3);
    poly([[800, 1480], [800, 1330], ['q', 800, 1310, 830, 1306], [990, 1306], ['q', 1020, 1310, 1020, 1330], [1020, 1480]], '#C9D3DC', () => { fillPoly([[950, 1300], [1030, 1300], [1030, 1490], [950, 1490]], '#9AA6B0'); fillPoly([[820, 1320], [850, 1320], [850, 1480], [820, 1480]], '#EEF3F7') }, 5);
    ell(910, 1306, 112, 18, '#AEB8C2', null, 4); ell(910, 1282, 16, 22, '#2a2a2a', null, 3);
    poly([[1010, 1300], [1150, 1290], [1150, 1316], [1010, 1318]], '#1e1e1e', null, 4);
    // bowl of green chillies (left)
    poly([[60, 1500], [260, 1500], ['q', 250, 1556, 160, 1558], ['q', 70, 1556, 60, 1500]], '#C9D3DC', () => fillEll(200, 1530, 50, 24, '#9AA6B0'), 4);
    for (let i = 0; i < 5; i++) { c.save(); c.translate(90 + i * 34, 1494); c.rotate(-.5 + i * .25); poly([[-6, 0], [6, 0], ['q', 10, -40, 0, -70], ['q', -10, -40, -6, 0]], '#3C9A3A', null, 3); c.restore() }
    c.restore();
  });
}
const backImg = () => kitchenBack();
const backBlur = () => blurred('kbackB', kitchenBack(), 16);
function counter() {
  // granite slab + wooden cabinets
  poly([[-400, CTOP - 12], [1480, CTOP - 12], [1480, CTOP + 34], [-400, CTOP + 34]], '#2F3B3A', () => { for (let i = 0; i < 60; i++) fillEll(-380 + i * 31, CTOP + (i * 7) % 30, 3, 2, '#7A8A88'); fillPoly([[-400, CTOP - 12], [1480, CTOP - 12], [1480, CTOP - 4], [-400, CTOP - 4]], '#55625F') }, 5);
  poly([[-400, CTOP + 34], [1480, CTOP + 34], [1480, 2100], [-400, 2100]], '#B5763F', () => fillPoly([[-400, CTOP + 34], [1480, CTOP + 34], [1480, CTOP + 60], [-400, CTOP + 60]], 'rgba(0,0,0,.2)'), 5);
  for (let i = -1; i < 5; i++) { const x = 20 + i * 270; poly([[x, CTOP + 80], [x + 240, CTOP + 80], [x + 240, 2000], [x, 2000]], '#C4844A', () => fillPoly([[x + 180, CTOP + 80], [x + 240, CTOP + 80], [x + 240, 2000], [x + 180, 2000]], '#A86A35'), 4); line([[x + 200, CTOP + 130], [x + 200, CTOP + 220]], 10, '#C9D3DC', false) }
}
function board() { poly([[260, CTOP - 12], [300, CTOP - 44], [800, CTOP - 44], [830, CTOP - 12]], '#D9A066', () => { fillPoly([[260, CTOP - 22], [830, CTOP - 22], [830, CTOP - 12], [260, CTOP - 12]], '#B57D45'); for (let i = 0; i < 5; i++) line([[330 + i * 100, CTOP - 40], [360 + i * 100, CTOP - 26]], 2, '#B98450', false) }, 4) }
const OX = 420, OYc = CTOP - 44 - 52, OR = 58;
function kitchen(t, o = {}) {
  c.drawImage(o.blur ? backBlur() : backImg(), -400, 0);
  if (o.papa) person(o.papa);
  if (o.mid) o.mid();
  counter(); board();
  if (o.front) o.front();
}
// Papa presets
function papa(t, face, arms, extra = {}) { return { ...PAPA, x: DX, y: DY, s: DS, noShadow: true, face, arms, ...extra } }
const restArms = (p) => [armTo(p, -1, 300, 1530, 40), armTo(p, 1, 780, 1530, 40)];
const knifeHand = (rot, shine = 0) => (x, y) => knife(x, y, rot, .62, shine);
// ---------- scenes ----------
const SC = []; const at = (a, b, fn) => SC.push([a, b, fn]);
const T1 = S[1] - .05, T2 = S[2] - .05, T2b = 6.15, T3 = S[3] - .06, T4 = 8.45, T5 = S[4] - .03, T6 = S[5] - .05, T6b = 14.35, T7 = S[6] - .08, T7b = 18.7, T8 = S[7] - .1, T8b = 21.55, T8c = 23.05, T9 = S[8] - .06, T9b = 26.75, T9c = E[8] + .15;
// A. villain onion macro
at(0, T1, t => {
  const u = ease(pr(t, 0, T1)), z = lerp(5.2, 6.4, u), br = lerp(0, 1, ease(pr(t, .7, 1.1)));
  cam(z, OX + 10, OYc - 20, 0, t, () => kitchen(t, { blur: true, front: () => onion(OX, OYc, OR, { brow: br, mouth: t > 1.0 ? 'smirk' : 'innocent', lid: .25 * br, look: [.3, -.2] }, t) }));
  if (t > 1.2 && t < 1.6) sparkle(560, 760, 60 * Math.sin(pr(t, 1.2, 1.6) * Math.PI));
});
// B. wide establishing -> push to Papa
at(T1, T2, t => {
  const u = easeOut(pr(t, T1, T2)), z = lerp(1.0, 1.55, u), cx = lerp(540, 560, u), cy = lerp(960, 1290, u);
  const p = papa(t, { look: [0, .4], brow: -.2, mouth: 'smile', lid: .2 + blink(t) * .7 }, null); p.arms = [armTo(p, -1, 340, 1520, 40), armTo(p, 1, 700, 1500, 50, knifeHand(.2))];
  cam(z, cx, cy, 0, t, () => kitchen(t, { papa: p, front: () => onion(OX, OYc, OR, { brow: 1, mouth: 'smirk', lid: .3, look: [.8, -.8] }, t) }));
});
// C1. Papa smug close-up, scoffs, head up
at(T2, T2b, t => {
  const z = lerp(2.3, 2.45, pr(t, T2, T2b)), dl = talk('d', t, 'tight', 'open');
  const p = papa(t, { look: [.2, -.3], brow: -.3, browUp: .6, lid: .45, ...dl }, null, { tilt: -.05 + Math.sin(t * 5) * .02 });
  p.arms = [armTo(p, -1, 330, 1500, 40), [40, 40, 120, -140, knifeHand(-1.3)]];
  cam(z, DX + 20, FACE_Y + 40, 0, t, () => kitchen(t, { papa: p }));
});
// C2. over-the-onion: onion big in front, Papa bragging behind
at(T2b, T3, t => {
  const z = lerp(2.0, 2.15, pr(t, T2b, T3)), dl = talk('d', t, 'tight', 'open');
  const p = papa(t, { look: [-.4, .5], brow: -.2, lid: .35, ...dl }, null, { tilt: .03 });
  p.arms = [armTo(p, -1, 330, 1500, 40), armTo(p, 1, 700, 1420, 30, knifeHand(-.6))];
  cam(z, 470, 1350, 0, t, () => kitchen(t, { papa: p, front: () => onion(OX, OYc, OR * 1.0, { brow: 1.2, mouth: 'smirk', lid: .45, look: [.9, -.9] }, t) }));
});
// D. CHOP punch-in
at(T3, T4, t => {
  const hit = S[3] + .05, u = pr(t, T3, hit), after = t > hit, z = after ? lerp(2.6, 2.9, pr(t, hit, T4)) : lerp(1.7, 2.0, u), sh = after && t < hit + .35 ? 16 * (1 - pr(t, hit, hit + .35)) : 0;
  const p = papa(t, { look: [-.5, .8], brow: -.6, mouth: after ? 'grin' : 'tight', lid: .2 }, null);
  const hy = after ? OYc + 10 : lerp(1300, OYc + 10, u * u);
  p.arms = [armTo(p, -1, 300, 1520, 40), armTo(p, 1, OX + 310, hy, 20, knifeHand(after ? 0 : -.5))];
  cam(z, OX + 40, OYc - 60, sh, t, () => kitchen(t, { papa: p, front: () => {
    onion(OX, OYc, OR, after ? { half: 14 * easeOut(pr(t, hit, hit + .2)), brow: .6, mouth: 'ouch', look: [0, -1], eye: 1.2 } : { brow: 1, mouth: 'smirk', lid: .3, look: [.5, -1] }, t);
    if (after && t < hit + .3) { const k = pr(t, hit, hit + .3); c.save(); c.globalAlpha = 1 - k; for (let i = 0; i < 8; i++) { const a = -Math.PI * (i + .5) / 8; fillEll(OX + Math.cos(a) * (40 + k * 120), OYc - 20 + Math.sin(a) * (30 + k * 110), 7, 9, '#F6E6EE') } c.restore() }
  } }));
});
// E. MACRO: inside the onion, cells burst along the knife's path
function cells(t, popT, zoomTo = 0) {
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#F8DCE8'); g.addColorStop(1, '#EFC3D6'); c.fillStyle = g; c.fillRect(-200, -200, W + 400, H + 400);
  const cw = 170, ch = 120;
  for (let r = -1; r < 18; r++) for (let k = -1; k < 8; k++) {
    const x = k * cw + (r % 2) * cw / 2, y = r * ch;
    const d = Math.abs((x + cw / 2) * .9 - (y + ch / 2) * .55 + 140) / 120; // distance to the cut line
    const pt = popT + d * .12, popped = t > pt && d < 1.1;
    if (popped) {
      const u = clamp((t - pt) / .25);
      c.save(); c.globalAlpha = 1 - u; c.beginPath(); c.ellipse(x + cw / 2, y + ch / 2, cw * .46 * (1 + u * .4), ch * .44 * (1 + u * .4), 0, 0, 7); c.lineWidth = 5; c.strokeStyle = '#B94F84'; c.stroke(); c.restore();
      c.save(); c.globalAlpha = .8 * (1 - u * .5); for (let i = 0; i < 5; i++) { const a = i * 1.26 + r; fillEll(x + cw / 2 + Math.cos(a) * u * 70, y + ch / 2 + Math.sin(a) * u * 50, 8, 8, i % 2 ? '#A55BD6' : '#F2C14E') } c.restore();
    } else {
      ell(x + cw / 2, y + ch / 2, cw * .46, ch * .44, '#FBEFF4', () => fillEll(x + cw / 2 + 20, y + ch / 2 + 16, cw * .36, ch * .3, '#F4D6E3'), 5);
      // two kept-apart chemicals in every cell
      fillEll(x + cw / 2 - 30, y + ch / 2, 14, 14, '#A55BD6'); fillEll(x + cw / 2 + 30, y + ch / 2, 14, 14, '#F2C14E');
      line([[x + cw / 2, y + ch / 2 - 30], [x + cw / 2, y + ch / 2 + 30]], 4, '#D9A2BE', false);
    }
  }
}
at(T4, T5, t => {
  const z = lerp(1.0, 1.12, pr(t, T4, T5)), bladeU = ease(pr(t, T4 + .05, T4 + .75));
  cam(z, 540, 960, 0, t, () => {
    cells(t, T4 + .15);
    // giant blade sweeping through
    c.save(); c.translate(lerp(-500, 1500, bladeU), lerp(380, 1250, bladeU)); c.rotate(.55); knife(0, 0, 0, 4.2, bladeU); c.restore();
  });
});
// F. two chemicals meet -> gas is born
function chem(x, y, r, col, face, t, ph = 0) {
  ell(x, y + Math.sin(t * 8 + ph) * 6, r, r * .92, col, () => fillEll(x + r * .35, y + r * .35, r * .7, r * .5, dark(col, .18)), 6);
  const yy = y + Math.sin(t * 8 + ph) * 6;
  for (const q of [-1, 1]) { ell(x + q * r * .3, yy - r * .1, r * .16, r * .2, '#FFFFFF', () => fillEll(x + q * r * .3 + r * .04 * face.look, yy - r * .08, r * .09, r * .11, '#111'), 4) }
  if (face.m === 'o') ell(x, yy + r * .35, r * .14, r * .12, '#5A1414', null, 4);
  else { c.beginPath(); c.moveTo(x - r * .3, yy + r * .3); c.quadraticCurveTo(x, yy + r * .55, x + r * .3, yy + r * .3); stroke(6) }
}
at(T5, T6, t => {
  const wallBreak = T5 + .4, meet = S[4] + 1.15, born = S[4] + 1.75;
  const u = ease(pr(t, wallBreak, meet)), z = lerp(1.05, 1.15, pr(t, T5, T6));
  cam(z, 540, 960, t > meet && t < meet + .25 ? 10 : 0, t, () => {
    c.fillStyle = '#F8DCE8'; c.fillRect(-200, -200, W + 400, H + 400);
    // one giant cell
    ell(540, 960, 470, 600, '#FBEFF4', () => fillEll(640, 1080, 380, 460, '#F4D6E3'), 8);
    // membrane wall in the middle, cracking
    if (t < wallBreak + .3) { const k = pr(t, wallBreak, wallBreak + .3); c.save(); c.globalAlpha = 1 - k; line([[540, 420], [520 - k * 60, 700], [560 + k * 60, 960], [520 - k * 40, 1220], [540, 1500]], 12, '#D9A2BE'); c.restore() }
    if (t < born) {
      chem(lerp(330, 470, u), 960, 120, '#A55BD6', { look: 1, m: t > meet - .2 ? 'o' : 's' }, t);
      chem(lerp(750, 610, u), 960, 120, '#F2C14E', { look: -1, m: t > meet - .2 ? 'o' : 's' }, t, 1.3);
      if (t > meet) { const k = pr(t, meet, born); c.save(); c.globalAlpha = 1 - k; for (let i = 0; i < 10; i++) { const a = i * .63; fillEll(540 + Math.cos(a) * k * 300, 960 + Math.sin(a) * k * 300, 18, 18, '#FFF6A0') } c.restore() }
    } else {
      const k = easeOut(pr(t, born, born + .35)), rise = pr(t, born, T6) * 220;
      gas(540, 960 - rise, lerp(.4, 2.4, k), 1, t);
    }
  });
});
// G1. gas floats up to Papa's face
at(T6, T6b, t => {
  const u = ease(pr(t, T6, T6b)), z = lerp(1.6, 1.85, u);
  const p = papa(t, { look: [-.4, lerp(.8, .1, u)], brow: lerp(-.2, .5, u), mouth: u > .7 ? 'flat' : 'smile', lid: .15 }, null);
  p.arms = [armTo(p, -1, 300, 1520, 40), armTo(p, 1, 700, 1500, 40, knifeHand(0))];
  cam(z, 520, lerp(1380, 1300, u), 0, t, () => kitchen(t, { papa: p, front: () => {
    onion(OX, OYc, OR, { half: 14, brow: 1, mouth: 'smirk', lid: .3, look: [.6, -1] }, t);
    gas(lerp(OX + 20, DX - 10, u) + Math.sin(t * 4) * 20, lerp(OYc - 80, EYE_Y + 20, u), lerp(.35, .55, u), .92, t);
  } }));
});
// G2. eye close-up: sting, squint, flood
at(T6b, T7, t => {
  const z = lerp(3.6, 3.9, pr(t, T6b, T7)), fl = pr(t, 15.0, 16.2), sq = clamp(pr(t, T6b, T6b + .4));
  const p = papa(t, { look: [0, 0], brow: lerp(0, 1, sq), lid: lerp(.1, .55, sq), eye: 1.05, tears: fl > 0, mouth: fl > .2 ? 'wobble' : 'flat' }, null);
  p.arms = restArms(p);
  cam(z, DX, EYE_Y + 30, fl > 0 ? 3 : 0, t, () => kitchen(t, { papa: p, mid: () => { tears(t, fl, 0); if (t < 15.0) { c.save(); c.globalAlpha = .65 * (1 - pr(t, 14.6, 15.0)); for (let i = 0; i < 6; i++) fillEll(DX - 80 + i * 32 + Math.sin(t * 6 + i) * 8, EYE_Y + 10 + Math.cos(t * 5 + i) * 14, 16, 16, '#DDF28C'); c.restore() } } }));
});
// H1. sobbing denial, tears fountain, onion halves chuckle
at(T7, T7b, t => {
  const z = lerp(1.45, 1.6, pr(t, T7, T7b)), dl = talk('d', t, 'wobble', 'shout');
  const p = papa(t, { look: [0, -.2], brow: 1, lid: .45, tears: true, ...dl }, null, { tilt: Math.sin(t * 9) * .04, nod: Math.max(0, Math.sin(t * 7)) * .15 });
  p.arms = [armTo(p, -1, 330, 1480, 30), armTo(p, 1, 760, 1450, 40, knifeHand(-.4))];
  cam(z, 540, 1330, 1.5, t, () => kitchen(t, { papa: p, mid: () => tears(t, 1, 1), front: () => onion(OX, OYc, OR, { half: 14, brow: .9, mouth: 'grin', lid: .4, look: [.5, -1], hop: Math.abs(Math.sin(t * 14)) * 6 }, t) }));
});
// H2. Papa points the knife at the onion -> onion CU, innocent
at(T7b, T8, t => {
  const z = lerp(4.0, 4.4, pr(t, T7b, T8));
  const p = papa(t, { look: [-.5, .8], brow: -.8, lid: .3, tears: true, mouth: 'shout', open: .7 }, null);
  p.arms = restArms(p);
  cam(z, OX - 10, OYc - 30, 0, t, () => kitchen(t, { blur: true, front: () => { onion(OX, OYc, OR, { half: 14, brow: -.6, mouth: 'innocent', look: [.6, -.5], eye: 1.15 }, t); knife(OX + 300 + Math.sin(t * 30) * 4, OYc - 30, .12, .8) } }));
});
// I. tip 1: chill the onion (fridge)
function fridge(t) {
  c.fillStyle = '#E3EEF6'; c.fillRect(-200, -200, W + 400, H + 400);
  const g = c.createRadialGradient(540, 700, 80, 540, 900, 1100); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#BFD8EA'); c.fillStyle = g; c.fillRect(60, 160, 960, 1600);
  for (const y of [560, 1060, 1500]) { poly([[60, y], [1020, y], [1020, y + 18], [60, y + 18]], 'rgba(220,240,250,.9)', () => fillPoly([[60, y + 12], [1020, y + 12], [1020, y + 18], [60, y + 18]], '#9EC1D8'), 4) }
  // milk packet, curd bowl, tomatoes, bottle
  poly([[130, 560], [130, 380], [180, 340], [260, 340], [260, 560]], '#FFFFFF', () => { fillPoly([[130, 440], [260, 440], [260, 500], [130, 500]], '#3D7FD1'); fillPoly([[220, 340], [260, 340], [260, 560], [220, 560]], '#E3E8EE') }, 4);
  poly([[760, 560], [740, 470], [960, 470], [940, 560]], '#C9D3DC', () => fillEll(850, 470, 110, 20, '#FFFFFF'), 4);
  for (const x of [190, 270, 230]) ell(x, x === 230 ? 990 : 1020, 46, 40, '#E5483B', () => fillEll(x + 14, 1030, 30, 22, '#C5352A'), 4);
  poly([[860, 1060], [860, 800], [890, 760], [890, 700], [930, 700], [930, 760], [960, 800], [960, 1060]], 'rgba(120,200,160,.7)', null, 4);
  c.fillStyle = 'rgba(30,60,90,.08)'; c.fillRect(-200, -200, 260, H + 400); c.fillRect(1020, -200, 260, H + 400);
  // door edge
  poly([[0, 120], [60, 160], [60, 1760], [0, 1800]], '#F4F7FA', null, 5);
}
at(T8, T8b, t => {
  const z = lerp(1.25, 1.45, pr(t, T8, T8b));
  cam(z, 540, 900, 0, t, () => { fridge(t); onion(540, 940, 120, { cold: clamp(pr(t, T8, T8 + .6)), shiver: 1, brow: .2, mouth: 'chatter', lid: .3, look: [0, .2] }, t);
    c.save(); c.globalAlpha = .5; for (let i = 0; i < 14; i++) { const ph = (t * .25 + i * .071) % 1; fillEll(120 + (i * 137) % 860, 200 + ph * 1400, 6, 6, '#FFFFFF') } c.restore() });
});
// J. tip 2: sharp knife slices clean, gas fizzles
at(T8b, T8c, t => {
  const z = lerp(3.3, 3.5, pr(t, T8b, T8c)), sl = ease(pr(t, T8b + .15, T8b + .55));
  cam(z, OX + 20, OYc - 40, 0, t, () => kitchen(t, { blur: true, front: () => {
    onion(OX, OYc, OR, sl < 1 ? { cold: .8, brow: .3, mouth: 'ouch', look: [.6, -1] } : { cold: .8, half: 6, brow: -.4, mouth: 'sad', look: [0, .4] }, t);
    knife(OX + 240, lerp(OYc - 200, OYc + 10, sl), 0, .9, pr(t, T8b + .6, T8b + 1.1));
    if (t > T8b + .55) { const k = pr(t, T8b + .55, T8c); gas(OX + 30, OYc - 80 - k * 40, .18, (1 - k) * .9, t, 'sad') }
    sparkle(OX + 60 + Math.sin(t) * 4, OYc - 160, 26 * Math.abs(Math.sin(t * 5)));
  } }));
});
// K. happy fast chopping, dry eyes; onion defeated
at(T8c, T9, t => {
  const z = lerp(1.5, 1.6, pr(t, T8c, T9)), ch = Math.abs(Math.sin(t * 16));
  const p = papa(t, { look: [-.4, .7], brow: -.2, mouth: 'bigsmile', lid: .25 }, null, { tilt: Math.sin(t * 4) * .03 });
  p.arms = [armTo(p, -1, 300, 1500, 40), armTo(p, 1, OX + 300, OYc - 20 - ch * 70, 30, knifeHand(-.1 - ch * .2))];
  cam(z, 540, 1320, 0, t, () => kitchen(t, { papa: p, front: () => {
    onion(OX - 60, OYc, OR * .9, { half: 8, cold: .5, brow: -.5, mouth: 'sad', look: [.4, .6], lid: .4 }, t);
    for (let i = 0; i < 9; i++) { const x = OX + 80 + (i % 5) * 26, y = CTOP - 54 - Math.floor(i / 5) * 18; ell(x, y, 14, 9, '#F3D7E4', () => fillEll(x + 4, y + 3, 8, 4, '#D9A2BE'), 3) }
  } }));
});
// L. Mom's hand drops a giant sack of onions (thud)
function sack(x, y, s, t, faces = true) {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadowBlob(0, 0, 260, 26, .3);
  poly([[-230, 0], ['q', -270, -200, -190, -380], [190, -380], ['q', 270, -200, 230, 0]], '#C49A5C', () => { for (let i = -6; i <= 6; i++) line([[i * 38, -380], [i * 40, 0]], 3, '#A27A40', false); for (let k = 0; k < 9; k++) line([[-250, -k * 42], [250, -k * 42]], 3, '#A27A40', false); fillPoly([[90, -380], [260, -380], [260, 0], [110, 0]], 'rgba(0,0,0,.14)') }, 6);
  poly([[-200, -380], [200, -380], [214, -340], [-214, -340]], '#B08848', null, 5);
  const P = [[-140, -400, 52], [-40, -420, 56], [70, -410, 54], [160, -396, 50], [-90, -460, 50], [20, -470, 54], [120, -455, 48], [-30, -515, 48]];
  for (const [ox, oy, r] of P) onion(ox, oy, r, faces ? { brow: 1.1, mouth: 'smirk', lid: .35, look: [-.6, -.3], noShadow: true } : { noShadow: true }, t);
  c.restore();
}
at(T9, T9b, t => {
  const drop = S[8] + .35, u = pr(t, T9, drop), landed = t > drop, z = lerp(1.15, 1.25, pr(t, T9, T9b)), sh = landed && t < drop + .3 ? 14 * (1 - pr(t, drop, drop + .3)) : 0;
  const sy = landed ? CTOP - 30 : lerp(700, CTOP - 30, u * u);
  const p = papa(t, { look: landed ? [.7, .4] : [-.4, .7], brow: landed ? .6 : -.2, mouth: landed ? 'flat' : 'bigsmile', lid: landed ? 0 : .25, eye: landed ? 1.15 : 1, pupil: landed ? .3 : .42 }, null);
  p.arms = [armTo(p, -1, 330, 1500, 40), armTo(p, 1, 640, 1500, 40, knifeHand(0))];
  cam(z, 590, 1250, sh, t, () => kitchen(t, { papa: p, front: () => {
    onion(OX - 60, OYc, OR * .9, { half: 8, cold: .5, brow: landed ? 1 : -.5, mouth: landed ? 'smirk' : 'sad', look: [.6, -.6], lid: .35 }, t);
    sack(860, sy, .8, t);
    // Mom's arm: bangles + saree pallu
    const ay = sy - 330;
    if (!landed || t < drop + .6) { const k = landed ? pr(t, drop, drop + .6) : 0; c.save(); c.translate(k * 300, -k * 200);
      fillPoly([[1130, ay - 520], [1400, ay - 560], [1400, ay - 300], [1180, ay - 330]], '#E84E8A');
      for (const q of [-1, 1]) { c.save(); c.beginPath(); c.moveTo(1250, ay - 420); c.lineTo(900 + q * 40, ay - 40); c.lineCap = 'round'; c.lineWidth = 64; c.strokeStyle = OUT; c.stroke(); c.lineWidth = 54; c.strokeStyle = '#B97A4E'; c.stroke(); c.restore(); break }
      for (let i = 0; i < 4; i++) { const bx = lerp(1010, 975, i / 3), by = lerp(ay - 215, ay - 175, i / 3); ell(bx, by, 14, 40, i % 2 ? '#E5B53B' : '#D7263D', null, 3, -.75) }
      ell(880, ay - 20, 36, 32, '#B97A4E', null, 5);
      c.restore() }
  } }));
});
// M. Papa's face freezes, smile dies, one tear
at(T9b, T9c, t => {
  const u = ease(pr(t, T9b, T9c)), z = lerp(2.4, 3.0, u), tr = pr(t, 27.55, 28.2);
  const p = papa(t, { look: [.7, .45], brow: lerp(.4, 1, u), lid: lerp(0, .35, u), eye: 1.15, pupil: .3, mouth: u > .4 ? 'wobble' : 'flat' }, null);
  p.arms = restArms(p);
  cam(z, DX + 10, FACE_Y + 30, t > 27.6 && Math.sin(t * 40) > .6 ? 2 : 0, t, () => kitchen(t, { papa: p, mid: () => { if (tr > 0) { const x = DX - 45 * DS, y = EYE_Y + 32 + tr * 90; c.save(); poly([[x, y - 26], ['q', x + 16, y + 4, x, y + 14], ['q', x - 16, y + 4, x, y - 26]], '#7CCBF2', () => fillEll(x - 4, y, 4, 6, '#FFFFFF'), 3); c.restore() } } }));
});
// N. the sack of smirking onions (loops to the first frame)
at(T9c, DUR + .1, t => {
  const z = lerp(2.0, 2.3, pr(t, T9c, DUR));
  cam(z, 860, CTOP - 420, 0, t, () => kitchen(t, { blur: true, front: () => sack(860, CTOP - 30, .8, t) }));
});
export function draw(t) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#F1D9A4'; c.fillRect(0, 0, W, H);
  for (const [a, b, fn] of SC) if (t >= a && t < b) { fn(t); break }
  c.restore();
  captions(groups, t, KEYS, 1690);
  finish(t);
}
export const cues = [];
