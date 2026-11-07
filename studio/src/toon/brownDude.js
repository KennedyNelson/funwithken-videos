// BROWN DUDE: our recurring fitness / body-science character (style: "Clean Fitness Line Art", see shorts-animation-styles).
// Front view, feet at (0,0), about 1000 units tall at s=1. Flat warm-brown skin, thin black line art with muscle definition,
// smooth bald almond head, white slit eyes with a built-in angled brow, no nose, tiny mouth only when talking.
// Signature kit: black training shorts with a saffron waistband, black wrist wraps. Never yellow, never a copy of another channel's mascot.
import { ctx, mix, smooth } from './toon.js';
export const BD = { skin: '#A8693F', shade: '#8C5532', hi: '#C4875A', line: '#161210', shorts: '#26272B', shortsHi: '#3A3C42', band: '#F08A24', wrap: '#1E1E22' };
const LW = 4.5;
function P(c, pts, fill, lw = LW) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) { const p = pts[i]; if (p.length === 4) c.quadraticCurveTo(p[0], p[1], p[2], p[3]); else c.lineTo(p[0], p[1]) } c.closePath(); if (fill) { c.fillStyle = fill; c.fill() } if (lw) { c.lineWidth = lw; c.strokeStyle = BD.line; c.lineJoin = 'round'; c.stroke() } }
function L(c, pts, lw = 3) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) { const p = pts[i]; if (p.length === 4) c.quadraticCurveTo(p[0], p[1], p[2], p[3]); else c.lineTo(p[0], p[1]) } c.lineWidth = lw; c.lineCap = 'round'; c.strokeStyle = BD.line; c.stroke() }
// ---- head (centre 0,0, ~150 tall) ----
export function bdHead(o = {}) {
  const c = ctx(), e = o.expr || 'focused', look = o.look || 0;
  c.save(); if (o.tilt) c.rotate(o.tilt);
  P(c, [[0, -78], [52, -74, 58, -20], [62, 30, 40, 62], [20, 82, 0, 84], [-20, 82, -40, 62], [-62, 30, -58, -20], [-52, -74, 0, -78]], BD.skin);
  c.save(); c.beginPath(); c.ellipse(0, 0, 60, 84, 0, 0, 7); c.clip(); c.fillStyle = BD.shade; c.beginPath(); c.ellipse(46, 18, 26, 70, -.1, 0, 7); c.fill(); c.fillStyle = BD.hi; c.beginPath(); c.ellipse(-24, -48, 14, 9, -.4, 0, 7); c.fill(); c.restore();
  L(c, [[0, -78], [52, -74, 58, -20], [62, 30, 40, 62], [20, 82, 0, 84], [-20, 82, -40, 62], [-62, 30, -58, -20], [-52, -74, 0, -78]], LW);
  // centre-face ridge (subtle, like a mask seam) from brow to chin
  L(c, [[2, -6], [4, 30], [2, 58]], 2.5);
  // eyes: white almond slits, the top edge is the brow
  const eyes = { focused: [.7, -.4], angry: [.6, -.75], calm: [.5, -.15], tired: [.3, -.1], shocked: [1.3, 0], smug: [.5, -.45] }[e] || [.55, -.35];
  for (const q of [-1, 1]) {
    const x = q * 26, y = -12, w = 25, h = 20 * eyes[0], sl = -eyes[1] * 10;   // sl>0: inner corner lower (stern)
    const inn = [x - q * w, y + sl], out = [x + q * w, y - sl * .4];
    c.beginPath(); c.moveTo(inn[0], inn[1]); c.quadraticCurveTo(x, y - h - 4, out[0], out[1]); c.quadraticCurveTo(x, y + h, inn[0], inn[1]); c.closePath();
    c.fillStyle = '#FFFFFF'; c.fill(); c.lineWidth = 3.5; c.strokeStyle = BD.line; c.stroke();
    L(c, [[inn[0], inn[1] - 4], [x, y - h - 10, out[0] + q * 4, out[1] - 6]], 5.5);
    if (e === 'shocked') { c.fillStyle = BD.line; c.beginPath(); c.arc(x + look * 6, y + 1, 3.5, 0, 7); c.fill() }
  }
  // mouth: none at rest; a small shape when talking (o.talk 0..1) or an expression
  if (o.talk > .1) { c.beginPath(); c.ellipse(2, 52, 10, 4 + o.talk * 8, 0, 0, 7); c.fillStyle = '#3a1a14'; c.fill(); c.lineWidth = 3; c.strokeStyle = BD.line; c.stroke() }
  else if (e === 'smug') L(c, [[-8, 54], [4, 58, 14, 50]], 3);
  else if (e === 'tired' || e === 'shocked') L(c, [[-8, 54], [8, 54]], 3);
  if (o.sweat) { c.fillStyle = '#BFE6F7'; c.beginPath(); c.moveTo(56, -40); c.quadraticCurveTo(66, -22, 58, -16); c.quadraticCurveTo(48, -22, 56, -40); c.fill(); c.lineWidth = 2.5; c.stroke() }
  c.restore();
}
// limb segment: organic muscle capsule from a to b, widths wa->wb, bulge adds a belly (bicep/calf) toward side bs (+1/-1)
function seg(c, a, b, wa, wb, fill, bulge = 0, bs = 1) {
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d, nx = -uy, ny = ux, L = [], R = [];
  for (let i = 0; i <= 8; i++) { const t = i / 8, w = wa + (wb - wa) * t, bl = bulge * Math.sin(Math.PI * Math.min(1, t * 1.25)); const x = a[0] + dx * t, y = a[1] + dy * t; L.push([x + nx * (w + (bs > 0 ? bl : bl * .35)), y + ny * (w + (bs > 0 ? bl : bl * .35))]); R.push([x - nx * (w + (bs < 0 ? bl : bl * .35)), y - ny * (w + (bs < 0 ? bl : bl * .35))]) }
  const capA = [a[0] - ux * wa * .8, a[1] - uy * wa * .8], capB = [b[0] + ux * wb * .8, b[1] + uy * wb * .8];
  const pts = [capA, ...L, capB, ...R.reverse()];
  c.beginPath(); smooth(pts); c.fillStyle = fill; c.fill(); c.lineWidth = LW; c.strokeStyle = BD.line; c.lineJoin = 'round'; c.stroke();
}
function fist(c, x, y, s = 1, wrap = true) { if (wrap) P(c, [[x - 24 * s, y - 34 * s], [x + 24 * s, y - 34 * s], [x + 26 * s, y - 10 * s], [x - 26 * s, y - 10 * s]], BD.wrap, 3.5); P(c, [[x - 24 * s, y - 12 * s], [x + 24 * s, y - 12 * s], [x + 28 * s, y + 10 * s, x + 18 * s, y + 26 * s], [x - 18 * s, y + 26 * s], [x - 28 * s, y + 10 * s, x - 24 * s, y - 12 * s]], BD.skin, 3.5); for (let i = 0; i < 3; i++) L(c, [[x - 12 * s + i * 12 * s, y + 4 * s], [x - 12 * s + i * 12 * s, y + 20 * s]], 2) }
// ---- full body, front view ----
// o: x,y,s,pose:'stand'|'armsCrossed'|'hang'|'point'|'flex', expr, talk, look, tilt, sweat
export function brownDude(o) {
  const c = ctx(), s = o.s || 1, pose = o.pose || 'stand';
  c.save(); c.translate(o.x, o.y); c.scale(s, s);
  if (!o.noShadow && pose !== 'hang') { c.save(); c.globalAlpha = .16; c.fillStyle = '#20202a'; c.beginPath(); c.ellipse(0, 6, 150, 18, 0, 0, 7); c.fill(); c.restore() }
  const hipY = -470, shY = -790, sw = 150;
  // legs
  for (const q of [-1, 1]) {
    const hip = [q * 50, hipY + 40], knee = [q * 62, -250], ank = [q * 58, -36];
    seg(c, knee, ank, 34, 20, BD.skin, 14, q); seg(c, hip, knee, 50, 34, BD.skin, 14, -q);
    L(c, [[q * 40, -330], [q * 70, -300, q * 64, -262]], 2.5); L(c, [[q * 74, -200], [q * 88, -140, q * 70, -90]], 2.5); L(c, [[q * 46, -190], [q * 40, -140, q * 50, -90]], 2);
    P(c, [[q * 40, -36], [q * 80, -36], [q * 98, -6, q * 92, 2], [q * 30, 2], [q * 26, -16, q * 40, -36]], BD.skin, 3.5);
    for (let i = 0; i < 3; i++) L(c, [[q * (60 + i * 10), -6], [q * (62 + i * 10), 2]], 2);
  }
  // shorts
  P(c, [[-sw + 22, hipY - 20], [sw - 22, hipY - 20], [sw + 4, hipY + 170], [24, hipY + 186], [0, hipY + 110], [-24, hipY + 186], [-sw - 4, hipY + 170]], BD.shorts);
  P(c, [[-sw + 22, hipY - 20], [sw - 22, hipY - 20], [sw - 16, hipY + 12], [-sw + 16, hipY + 12]], BD.band, 4);
  L(c, [[-90, hipY + 40], [-70, hipY + 120]], 2.5); L(c, [[96, hipY + 50], [80, hipY + 140]], 2.5); c.save(); c.globalAlpha = .5; L(c, [[-120, hipY + 30], [-130, hipY + 150]], 6); c.restore();
  // torso (V-taper) with muscle lines
  const T = [[-sw - 20, shY + 40], [-60, shY - 6], [60, shY - 6], [sw + 20, shY + 40], [sw + 10, shY + 140, sw - 10, shY + 190], [sw - 26, hipY - 40, sw - 22, hipY - 18], [-sw + 22, hipY - 18], [-sw + 26, hipY - 40, -sw + 10, shY + 190], [-sw - 10, shY + 140, -sw - 20, shY + 40]];
  P(c, T, BD.skin);
  c.save(); P(c, T, null, 0); c.clip(); c.fillStyle = BD.shade; c.fillRect(sw - 50, shY - 20, 90, 400); c.restore();
  L(c, [[-118, shY + 70], [-60, shY + 150, 0, shY + 140]], 3.5); L(c, [[118, shY + 70], [60, shY + 150, 0, shY + 140]], 3.5); L(c, [[0, shY + 30], [0, shY + 140]], 2.5);
  for (const q of [-1, 1]) { for (let i = 0; i < 3; i++) L(c, [[q * 8, shY + 180 + i * 62], [q * 40, shY + 172 + i * 62, q * 50, shY + 186 + i * 62]], 2.5); L(c, [[q * 58, shY + 165], [q * 70, shY + 260, q * 52, hipY - 30]], 2.5); L(c, [[q * 96, shY + 190], [q * 84, shY + 230]], 2); L(c, [[q * 92, shY + 240], [q * 80, shY + 280]], 2) }
  L(c, [[0, shY + 160], [0, hipY - 24]], 2.5);
  // neck + traps
  P(c, [[-52, shY + 6], [-34, shY - 74], [34, shY - 74], [52, shY + 6]], BD.skin, 4); L(c, [[-20, shY - 30], [-8, shY - 4]], 2.5); L(c, [[-36, shY - 4], [-90, shY + 4, -sw - 10, shY + 36]], 3.5); L(c, [[36, shY - 4], [90, shY + 4, sw + 10, shY + 36]], 3.5);
  // arms by pose
  const sh = q => [q * (sw + 6), shY + 52];
  const delt = (q, el) => { const S = sh(q), a = Math.atan2(el[1] - S[1], el[0] - S[0]); c.save(); c.translate(S[0] + Math.cos(a) * 18, S[1] + Math.sin(a) * 18); c.rotate(a); c.beginPath(); c.ellipse(0, 0, 62, 50, 0, 0, 7); c.fillStyle = BD.skin; c.fill(); c.lineWidth = LW; c.strokeStyle = BD.line; c.stroke(); L(c, [[-10, -30], [24, 0, -6, 34]], 2.5); c.restore() };
  const armDraw = (q, el, hd, fistOn = true) => { const S = sh(q); seg(c, el, hd, 30, 20, BD.skin, 10, q); seg(c, S, el, 40, 28, BD.skin, 16, q); delt(q, el); L(c, [[(S[0] + el[0]) / 2 - 10, (S[1] + el[1]) / 2], [(S[0] + el[0]) / 2 + 12, (S[1] + el[1]) / 2 + 20]], 2.5); if (fistOn) fist(c, hd[0], hd[1] + 10) };
  if (pose === 'armsCrossed') {
    for (const q of [-1, 1]) { const S = sh(q); seg(c, S, [q * 172, shY + 270], 42, 32, BD.skin, 18, q); delt(q, [q * 172, shY + 270]) }
    seg(c, [-170, shY + 270], [80, shY + 230], 32, 26, BD.skin, 10, -1); P(c, [[50, shY + 200], [100, shY + 205], [104, shY + 255], [54, shY + 262]], BD.wrap, 3.5);
    seg(c, [170, shY + 280], [-70, shY + 250], 34, 26, BD.skin, 10, -1); P(c, [[-100, shY + 222], [-50, shY + 220], [-48, shY + 278], [-98, shY + 282]], BD.wrap, 3.5);
    L(c, [[-60, shY + 230], [40, shY + 214]], 2.5); L(c, [[150, shY + 250], [60, shY + 262]], 2.5);
  } else if (pose === 'hang') {
    armDraw(-1, [-sw - 30, shY - 120], [-sw - 20, shY - 260]); armDraw(1, [sw + 30, shY - 120], [sw + 20, shY - 260]);
  } else if (pose === 'point') {
    armDraw(-1, [-sw - 46, shY + 200], [-sw - 40, shY + 390]);
    const S = sh(1), el = [sw + 90, shY + 170], hd = [sw + 60, shY - 10];
    seg(c, el, hd, 30, 22, BD.skin, 10, 1); seg(c, S, el, 40, 30, BD.skin, 16, 1); delt(1, el);
    P(c, [[hd[0] - 30, hd[1] + 10], [hd[0] + 30, hd[1] + 10], [hd[0] + 30, hd[1] + 40], [hd[0] - 30, hd[1] + 40]], BD.wrap, 3.5);
    P(c, [[hd[0] - 28, hd[1] + 12], [hd[0] - 30, hd[1] - 40, hd[0] - 6, hd[1] - 46], [hd[0] + 26, hd[1] - 44], [hd[0] + 34, hd[1] - 10, hd[0] + 28, hd[1] + 12]], BD.skin, 3.5);
    for (let i = 0; i < 3; i++) L(c, [[hd[0] - 2, hd[1] - 32 + i * 14], [hd[0] + 28, hd[1] - 30 + i * 14]], 2.5);
    P(c, [[hd[0] - 26, hd[1] - 40], [hd[0] - 28, hd[1] - 110, hd[0] - 16, hd[1] - 116], [hd[0] - 4, hd[1] - 110, hd[0] - 6, hd[1] - 40]], BD.skin, 3.5);
    P(c, [[hd[0] - 30, hd[1] - 10], [hd[0] - 52, hd[1] - 22, hd[0] - 44, hd[1] - 36], [hd[0] - 24, hd[1] - 30]], BD.skin, 3);
  } else if (pose === 'flex') {
    for (const q of [-1, 1]) { const S = sh(q), el = [q * (sw + 160), shY + 50]; seg(c, el, [q * (sw + 150), shY - 130], 32, 24, BD.skin, 12, -q); seg(c, S, el, 42, 32, BD.skin, 30, -1); delt(q, el); fist(c, q * (sw + 150), shY - 160) }
  } else { armDraw(-1, [-sw - 46, shY + 200], [-sw - 40, shY + 390]); armDraw(1, [sw + 46, shY + 200], [sw + 40, shY + 390]) }
  // head
  c.save(); c.translate(0, shY - 160); c.scale(1.15, 1.15); bdHead(o); c.restore();
  c.restore();
}
// flat pastel background with a soft floor shadow line (the channel-style plate)
export function plate(col = '#D7E4EE') { const c = ctx(); c.fillStyle = col; c.fillRect(-2000, -2000, 6000, 6000) }
export const PLATES = { blue: '#D7E4EE', cream: '#FCEFD9', lilac: '#D9D0EE', mint: '#D6EEDF', peach: '#F8DCCB' };
