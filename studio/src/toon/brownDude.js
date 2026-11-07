// BROWN DUDE v2: our own fitness / body-science character (style: Clean Fitness Line Art, see shorts-animation-styles).
// The body is ONE continuous human silhouette (torso + legs) plus one continuous outline per arm, drawn with smooth
// cubic curves and interior anatomy contour lines. No capsules, no joints, no "lego" pieces.
// Identity (ours): warm brown skin, bald head, short black beard and moustache, white focused eyes with thick brows,
// black shorts with a saffron waistband, black wrist wraps, barefoot.
import { ctx } from './toon.js';
export const BD = { skin: '#A8693F', shade: '#8E5733', hi: '#BF8256', line: '#1A1411', shorts: '#232428', shortsShade: '#17181B', band: '#F08A24', wrap: '#1C1C20', beard: '#1E1612' };
const LW = 4.2;
function trace(c, ops) {
  for (const o of ops) {
    if (o[0] === 'M') c.moveTo(o[1], o[2]);
    else if (o[0] === 'L') c.lineTo(o[1], o[2]);
    else if (o[0] === 'Q') c.quadraticCurveTo(o[1], o[2], o[3], o[4]);
    else c.bezierCurveTo(o[1], o[2], o[3], o[4], o[5], o[6]);
  }
}
// reverse an open path that starts with M (keeps the same curve, runs the other way)
function reverseOps(ops) {
  let cur = null; const segs = [];
  for (const o of ops) { if (o[0] === 'M') { cur = [o[1], o[2]]; continue } const end = o[0] === 'C' ? [o[5], o[6]] : o[0] === 'Q' ? [o[3], o[4]] : [o[1], o[2]]; segs.push({ o, from: cur }); cur = end }
  const out = [['M', cur[0], cur[1]]];
  for (let i = segs.length - 1; i >= 0; i--) { const { o, from } = segs[i]; if (o[0] === 'C') out.push(['C', o[3], o[4], o[1], o[2], from[0], from[1]]); else if (o[0] === 'Q') out.push(['Q', o[1], o[2], from[0], from[1]]); else out.push(['L', from[0], from[1]]) }
  return out;
}
const mirror = ops => ops.map(o => o[0] === 'C' ? ['C', -o[1], o[2], -o[3], o[4], -o[5], o[6]] : o[0] === 'Q' ? ['Q', -o[1], o[2], -o[3], o[4]] : [o[0], -o[1], o[2]]);
const join = (right) => { const l = reverseOps(mirror(right)); return [...right, ['L', l[0][1], l[0][2]], ...l.slice(1)] };
function shapeOps(c, ops, fill, lw = LW, shade) {
  c.beginPath(); trace(c, ops); c.closePath(); if (fill) { c.fillStyle = fill; c.fill() }
  if (shade) { c.save(); c.beginPath(); trace(c, ops); c.closePath(); c.clip(); shade(); c.restore() }
  if (lw) { c.beginPath(); trace(c, ops); c.closePath(); c.lineWidth = lw; c.strokeStyle = BD.line; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke() }
}
function stroke(c, ops, lw = 2.6, col = BD.line) { c.beginPath(); trace(c, ops); c.lineWidth = lw; c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke() }
const both = (c, ops, lw) => { stroke(c, ops, lw); stroke(c, mirror(ops), lw) };
// ---------- TORSO + LEGS silhouette, right half from the neck down to the crotch; feet on y=0 ----------
const RIGHT_BODY = [
  ['M', 0, -876], ['L', 36, -876],
  ['C', 37, -852, 42, -836, 62, -826],
  ['C', 104, -812, 146, -804, 176, -790],
  ['C', 182, -760, 172, -722, 156, -694],
  ['C', 148, -650, 128, -600, 112, -566],
  ['C', 104, -544, 108, -508, 122, -474],
  ['C', 140, -430, 146, -356, 126, -286],
  ['C', 120, -262, 122, -246, 116, -228],
  ['C', 132, -186, 118, -98, 86, -54],
  ['C', 86, -40, 92, -30, 104, -22],
  ['C', 120, -14, 124, -2, 110, 0],
  ['L', 42, 0], ['C', 32, -6, 36, -26, 44, -46],
  ['C', 38, -104, 28, -176, 36, -236],
  ['C', 34, -258, 30, -276, 28, -296],
  ['C', 22, -352, 14, -420, 4, -458],
  ['L', 0, -462]];
const BODY = join(RIGHT_BODY);
const RIGHT_SHORTS = [['M', 0, -540], ['L', 114, -540], ['C', 118, -510, 128, -486, 136, -460], ['C', 150, -420, 152, -380, 146, -336], ['C', 116, -320, 76, -318, 40, -326], ['C', 32, -360, 18, -404, 6, -446], ['L', 0, -450]];
const SHORTS = join(RIGHT_SHORTS);
// ---------- arms (right side, mirrored for the left), each one closed continuous outline ----------
const ARMS = {
  down: [['M', 152, -808], ['C', 204, -812, 226, -764, 218, -704],
    ['C', 216, -666, 224, -626, 218, -586],
    ['C', 232, -542, 236, -476, 226, -424],
    ['C', 234, -400, 240, -358, 228, -330], ['C', 218, -312, 194, -314, 190, -336],
    ['C', 184, -364, 186, -398, 192, -420],
    ['C', 180, -476, 172, -534, 178, -574],
    ['C', 178, -624, 162, -680, 150, -720],
    ['C', 144, -760, 138, -792, 152, -808]],
  up: [['M', 118, -770], ['C', 150, -800, 186, -790, 204, -820], ['C', 220, -850, 222, -880, 220, -910],
    ['C', 222, -950, 226, -990, 218, -1030],
    ['C', 222, -1080, 214, -1130, 204, -1168],
    ['C', 212, -1196, 210, -1236, 196, -1250], ['C', 182, -1262, 160, -1254, 160, -1234],
    ['C', 162, -1210, 170, -1190, 172, -1170],
    ['C', 168, -1124, 168, -1076, 172, -1034],
    ['C', 168, -970, 158, -910, 140, -860],
    ['C', 130, -830, 120, -800, 118, -770]]
};
function arm(c, kind, m) {
  const ops = m > 0 ? ARMS[kind] : mirror(ARMS[kind]);
  shapeOps(c, ops, BD.skin, LW, () => { c.fillStyle = BD.shade; c.beginPath(); if (kind === 'down') c.ellipse(m * 222, -560, 16, 260, 0, 0, 7); else c.ellipse(m * 214, -1000, 14, 240, 0, 0, 7); c.fill() });
  if (kind === 'down') {
    stroke(c, [['M', m * 198, -746], ['C', m * 186, -724, m * 182, -702, m * 188, -680]], 2.6);
    stroke(c, [['M', m * 170, -690], ['C', m * 182, -652, m * 186, -620, m * 182, -594]], 2.4);
    stroke(c, [['M', m * 202, -562], ['C', m * 208, -540, m * 206, -516, m * 200, -500]], 2.2);
    stroke(c, [['M', m * 200, -320], ['L', m * 202, -342]], 2); stroke(c, [['M', m * 212, -318], ['L', m * 214, -340]], 2);
    shapeOps(c, [['M', m * 188, -448], ['C', m * 204, -454, m * 222, -454, m * 233, -446], ['L', m * 233, -404], ['C', m * 220, -398, m * 202, -398, m * 187, -404]], BD.wrap, 3);
  } else {
    stroke(c, [['M', m * 198, -880], ['C', m * 184, -898, m * 176, -918, m * 178, -940]], 2.6);
    stroke(c, [['M', m * 158, -900], ['C', m * 174, -940, m * 182, -980, m * 184, -1010]], 2.4);
    shapeOps(c, [['M', m * 168, -1152], ['C', m * 182, -1158, m * 200, -1158, m * 210, -1152], ['L', m * 208, -1112], ['C', m * 196, -1106, m * 180, -1106, m * 168, -1112]], BD.wrap, 3);
  }
}
// ---------- head (centre 0,0) ----------
export function bdHead(o = {}) {
  const c = ctx(), e = o.expr || 'focused';
  c.save(); if (o.tilt) c.rotate(o.tilt);
  for (const m of [-1, 1]) shapeOps(c, [['M', m * 58, -16], ['C', m * 76, -26, m * 82, 4, m * 74, 20], ['C', m * 70, 32, m * 62, 32, m * 58, 26]], BD.skin, 3.5);
  const HEAD = [['M', 0, -80], ['C', 40, -80, 62, -54, 62, -10], ['C', 62, 26, 54, 52, 38, 68], ['C', 26, 80, 12, 86, 0, 86], ['C', -12, 86, -26, 80, -38, 68], ['C', -54, 52, -62, 26, -62, -10], ['C', -62, -54, -40, -80, 0, -80]];
  shapeOps(c, HEAD, BD.skin, LW, () => { c.fillStyle = BD.shade; c.beginPath(); c.ellipse(54, 10, 16, 80, -.08, 0, 7); c.fill(); c.fillStyle = BD.hi; c.beginPath(); c.ellipse(-22, -54, 16, 9, -.4, 0, 7); c.fill() });
  shapeOps(c, [['M', -60, 12], ['C', -56, 50, -30, 86, 0, 90], ['C', 30, 86, 56, 50, 60, 12], ['C', 52, 30, 42, 44, 28, 50], ['C', 16, 46, -16, 46, -28, 50], ['C', -42, 44, -52, 30, -60, 12]], BD.beard, 3);
  shapeOps(c, [['M', -26, 44], ['C', -12, 34, 12, 34, 26, 44], ['C', 12, 41, -12, 41, -26, 44]], BD.beard, 2.5);
  const cfg = { focused: [.75, .35, 0], angry: [.65, .8, 0], calm: [.6, .1, .2], tired: [.5, .05, .5], shocked: [1.25, -.5, 0], smug: [.6, .3, .35] }[e] || [.75, .35, 0];
  const look = o.look || 0;
  for (const m of [-1, 1]) {
    const x = m * 25, y = -12, w = 16, h = 12 * cfg[0];
    c.beginPath(); c.ellipse(x, y, w, h, 0, 0, 7); c.fillStyle = '#FFFFFF'; c.fill(); c.lineWidth = 3; c.strokeStyle = BD.line; c.stroke();
    c.save(); c.beginPath(); c.ellipse(x, y, w, h, 0, 0, 7); c.clip(); c.fillStyle = '#1b120d'; c.beginPath(); c.arc(x + look * 6, y + 1, 6, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x + look * 6 - 2, y - 2, 1.8, 0, 7); c.fill();
    if (cfg[2] > 0) { c.fillStyle = BD.skin; c.fillRect(x - w - 2, y - h - 2, 2 * w + 4, (2 * h + 4) * cfg[2]) } c.restore();
    if (cfg[2] > 0) stroke(c, [['M', x - w, y - h + 2 * h * cfg[2]], ['L', x + w, y - h + 2 * h * cfg[2]]], 3);
    // thick brow: inner end drops with cfg[1]
    const iy = y - h - 8 + cfg[1] * 10, oy = y - h - 10 - cfg[1] * 3;
    shapeOps(c, [['M', x - m * 20, iy], ['C', x - m * 6, y - h - 18, x + m * 8, y - h - 18, x + m * 22, oy], ['L', x + m * 21, oy + 7], ['C', x + m * 8, y - h - 10, x - m * 6, y - h - 10, x - m * 20, iy + 7]], BD.beard, 1.5);
  }
  stroke(c, [['M', 4, 0], ['C', 12, 14, 12, 24, 2, 28]], 3);
  if (o.talk > .1) shapeOps(c, [['M', -12, 56], ['C', -6, 54, 6, 54, 12, 56], ['C', 8, 62 + o.talk * 12, -8, 62 + o.talk * 12, -12, 56]], '#4a1b14', 2.5);
  else if (e === 'smug') shapeOps(c, [['M', -12, 57], ['C', 0, 60, 8, 58, 14, 51], ['C', 8, 62, -2, 63, -12, 57]], '#7A3B2A', 1.5);
  else if (e === 'shocked') shapeOps(c, [['M', -8, 56], ['C', -8, 70, 8, 70, 8, 56], ['C', 4, 52, -4, 52, -8, 56]], '#4a1b14', 2.5);
  else shapeOps(c, [['M', -12, 56], ['C', -4, 53, 4, 53, 12, 56], ['C', 4, 60, -4, 60, -12, 56]], '#7A3B2A', 1.5);
  if (o.sweat) shapeOps(c, [['M', 64, -44], ['C', 74, -26, 68, -16, 62, -18], ['C', 54, -22, 56, -32, 64, -44]], '#BFE6F7', 2.5);
  c.restore();
}
function anatomy(c) {
  both(c, [['M', 30, -818], ['C', 70, -810, 112, -806, 150, -796]], 2.2);
  stroke(c, [['M', 0, -800], ['L', 0, -690]], 2.4);
  both(c, [['M', 6, -688], ['C', 50, -668, 110, -676, 150, -716]], 3.2);
  both(c, [['M', 150, -762], ['C', 130, -742, 120, -722, 124, -702]], 2.2);
  stroke(c, [['M', 0, -680], ['L', 0, -540]], 2.4);
  for (const y of [-640, -598, -558]) both(c, [['M', 6, y], ['C', 26, y - 8, 46, y - 6, 58, y + 2]], 2.4);
  both(c, [['M', 62, -684], ['C', 72, -630, 70, -580, 58, -546]], 2.4);
  for (const y of [-652, -620, -588]) both(c, [['M', 114, y], ['L', 98, y + 12]], 2);
  both(c, [['M', 92, -300], ['C', 72, -292, 62, -270, 66, -250]], 2.4);
  both(c, [['M', 118, -322], ['C', 108, -302, 104, -282, 106, -264]], 2);
  both(c, [['M', 60, -246], ['C', 70, -238, 90, -238, 100, -246]], 2);
  both(c, [['M', 112, -196], ['C', 104, -160, 100, -130, 96, -110]], 2.2);
  both(c, [['M', 54, -180], ['C', 52, -150, 52, -120, 56, -96]], 2);
  both(c, [['M', 64, -8], ['L', 66, 0]], 2); both(c, [['M', 80, -10], ['L', 82, 0]], 2); both(c, [['M', 94, -12], ['L', 96, 0]], 2);
}
// o: x, y, s, pose: 'stand' | 'hang' (more poses to be added as continuous outlines), expr, talk, look, tilt, sweat
export function brownDude(o) {
  const c = ctx(), s = o.s || 1, pose = o.pose || 'stand';
  c.save(); c.translate(o.x, o.y); c.scale(s, s);
  if (!o.noShadow && pose !== 'hang') { c.save(); c.globalAlpha = .15; c.fillStyle = '#1e1a22'; c.beginPath(); c.ellipse(0, 6, 170, 18, 0, 0, 7); c.fill(); c.restore() }
  shapeOps(c, BODY, BD.skin, LW, () => { c.fillStyle = BD.shade; c.beginPath(); trace(c, [['M', 132, -800], ['C', 200, -780, 166, -620, 124, -560], ['C', 150, -480, 162, -360, 132, -280], ['C', 146, -200, 132, -100, 102, -40], ['L', 300, 0], ['L', 300, -900]]); c.closePath(); c.fill(); c.fillStyle = BD.hi; c.beginPath(); c.ellipse(-72, -742, 40, 16, -.3, 0, 7); c.fill() });
  anatomy(c);
  shapeOps(c, SHORTS, BD.shorts, LW, () => { c.fillStyle = BD.shortsShade; c.beginPath(); trace(c, [['M', 104, -540], ['C', 140, -480, 150, -400, 146, -330], ['L', 300, -330], ['L', 300, -540]]); c.closePath(); c.fill() });
  shapeOps(c, [['M', -114, -540], ['L', 114, -540], ['L', 118, -514], ['L', -118, -514]], BD.band, 3.2);
  both(c, [['M', 30, -506], ['C', 22, -470, 14, -452, 6, -446]], 2.4);
  both(c, [['M', 118, -470], ['C', 128, -420, 130, -380, 124, -342]], 2.2);
  if (pose === 'hang') { arm(c, 'up', 1); arm(c, 'up', -1) }
  else { arm(c, 'down', 1); arm(c, 'down', -1) }
  stroke(c, [['M', -22, -868], ['C', -18, -852, -12, -842, 0, -836]], 2.2);
  c.save(); c.translate(0, -948); bdHead(o); c.restore();
  c.restore();
}
export function plate(col = '#D7E4EE') { const c = ctx(); c.fillStyle = col; c.fillRect(-2000, -2000, 6000, 6000) }
export const PLATES = { blue: '#D7E4EE', cream: '#FCEFD9', lilac: '#D9D0EE', mint: '#D6EEDF', peach: '#F8DCCB' };
