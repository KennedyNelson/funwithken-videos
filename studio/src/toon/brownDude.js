// BROWN DUDE v3: our own fitness / body-science character (style: Clean Fitness Line Art, see shorts-animation-styles).
// Tall athletic proportions (about 8 heads), one continuous body silhouette that INCLUDES the shoulders/deltoids;
// the arms are drawn first, tucked behind the torso, so they grow out of the shoulder with no visible joint.
// Friendly face: short black hair, round eyes with highlights, arched brows, smile. No beard, no moustache.
// Kit: black shorts with a saffron waistband, black wrist wraps, barefoot.
import { ctx } from './toon.js';
export const BD = { skin: '#A8693F', shade: '#8F5835', hi: '#C28A5E', line: '#1A1411', hair: '#16110E', hairHi: '#3A2E28', shorts: '#232428', shortsShade: '#17181B', band: '#F08A24', wrap: '#1C1C20', mouth: '#6E2A20', tongue: '#D9675B', blush: '#D9675B' };
const LW = 4;
function trace(c, ops) { for (const o of ops) { if (o[0] === 'M') c.moveTo(o[1], o[2]); else if (o[0] === 'L') c.lineTo(o[1], o[2]); else if (o[0] === 'Q') c.quadraticCurveTo(o[1], o[2], o[3], o[4]); else c.bezierCurveTo(o[1], o[2], o[3], o[4], o[5], o[6]) } }
function reverseOps(ops) {
  let cur = null; const segs = [];
  for (const o of ops) { if (o[0] === 'M') { cur = [o[1], o[2]]; continue } const end = o[0] === 'C' ? [o[5], o[6]] : o[0] === 'Q' ? [o[3], o[4]] : [o[1], o[2]]; segs.push({ o, from: cur }); cur = end }
  const out = [['M', cur[0], cur[1]]];
  for (let i = segs.length - 1; i >= 0; i--) { const { o, from } = segs[i]; if (o[0] === 'C') out.push(['C', o[3], o[4], o[1], o[2], from[0], from[1]]); else if (o[0] === 'Q') out.push(['Q', o[1], o[2], from[0], from[1]]); else out.push(['L', from[0], from[1]]) }
  return out;
}
const mirror = ops => ops.map(o => o[0] === 'C' ? ['C', -o[1], o[2], -o[3], o[4], -o[5], o[6]] : o[0] === 'Q' ? ['Q', -o[1], o[2], -o[3], o[4]] : [o[0], -o[1], o[2]]);
const join = right => { const l = reverseOps(mirror(right)); return [...right, ['L', l[0][1], l[0][2]], ...l.slice(1)] };
function shapeOps(c, ops, fill, lw = LW, shade) {
  c.beginPath(); trace(c, ops); c.closePath(); if (fill) { c.fillStyle = fill; c.fill() }
  if (shade) { c.save(); c.beginPath(); trace(c, ops); c.closePath(); c.clip(); shade(); c.restore() }
  if (lw) { c.beginPath(); trace(c, ops); c.closePath(); c.lineWidth = lw; c.strokeStyle = BD.line; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke() }
}
function stroke(c, ops, lw = 2.4, col = BD.line) { c.beginPath(); trace(c, ops); c.lineWidth = lw; c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke() }
const both = (c, ops, lw) => { stroke(c, ops, lw); stroke(c, mirror(ops), lw) };
// ---------- body silhouette (right half, neck to crotch). Feet at y=0, top of the hair near -1110 ----------
const RIGHT_BODY = [
  ['M', 0, -962], ['L', 30, -962],
  ['C', 31, -944, 36, -930, 52, -922],            // neck into the trapezius
  ['C', 82, -912, 116, -906, 140, -900],          // trap slope
  ['C', 164, -894, 176, -872, 176, -846],         // deltoid cap (part of the body)
  ['C', 176, -820, 168, -800, 154, -790],         // underside of the deltoid
  ['C', 146, -768, 132, -726, 116, -700],         // lat
  ['C', 104, -682, 94, -668, 92, -650],           // waist
  ['C', 92, -620, 100, -594, 110, -566],          // hip
  ['C', 124, -526, 128, -436, 112, -332],         // outer thigh
  ['C', 108, -310, 108, -292, 102, -276],         // outer knee
  ['C', 118, -228, 106, -116, 78, -64],           // calf to the ankle
  ['C', 78, -48, 84, -36, 96, -28],               // ankle into the foot
  ['C', 114, -18, 118, -3, 104, 0],               // toes
  ['L', 40, 0], ['C', 30, -8, 32, -30, 40, -54],  // sole, heel
  ['C', 34, -122, 26, -212, 32, -278],            // inner calf to the knee
  ['C', 30, -300, 26, -320, 24, -344],            // inner knee
  ['C', 18, -420, 10, -500, 3, -536],             // inner thigh
  ['L', 0, -540]];
const BODY = join(RIGHT_BODY);
const RIGHT_SHORTS = [['M', 0, -660], ['L', 95, -660], ['C', 99, -630, 108, -600, 117, -570], ['C', 130, -530, 132, -490, 126, -448], ['C', 100, -434, 66, -432, 34, -440], ['C', 26, -478, 14, -520, 4, -548], ['L', 0, -552]];
const SHORTS = join(RIGHT_SHORTS);
// ---------- arms (right side; mirrored for the left). Drawn BEHIND the body, starting inside the deltoid ----------
const ARMS = {
  down: [['M', 126, -884], ['C', 166, -892, 182, -852, 180, -806],   // root hidden under the deltoid
    ['C', 180, -766, 186, -726, 182, -694],                           // outer upper arm (triceps) to the elbow
    ['C', 194, -654, 196, -594, 186, -552],                           // forearm swell to the wrist
    ['C', 194, -532, 198, -494, 188, -470], ['C', 180, -454, 160, -456, 158, -474], // relaxed hand
    ['C', 152, -500, 154, -530, 158, -550],                           // inner wrist
    ['C', 150, -600, 144, -650, 148, -690],                           // inner forearm to the elbow crease
    ['C', 148, -732, 140, -770, 126, -800],                           // biceps into the armpit
    ['C', 118, -830, 116, -862, 126, -884]],
  up: [['M', 120, -880], ['C', 150, -912, 176, -930, 178, -980],     // root under the deltoid, rising
    ['C', 180, -1020, 184, -1060, 178, -1100],                        // outer upper arm to the elbow
    ['C', 184, -1150, 178, -1196, 170, -1232],                        // forearm to the wrist
    ['C', 178, -1258, 176, -1294, 164, -1306], ['C', 152, -1318, 132, -1310, 132, -1292], // hand on the bar
    ['C', 134, -1270, 140, -1250, 142, -1232],                        // inner wrist
    ['C', 138, -1190, 138, -1144, 142, -1104],                        // inner forearm
    ['C', 138, -1044, 130, -990, 116, -944],                          // biceps down toward the armpit
    ['C', 108, -916, 110, -894, 120, -880]]
};
// widen a path horizontally around x = cx (makes the arms more muscular without redrawing them)
const widen = (ops, cx, k) => ops.map(o => o.map((v, i) => i === 0 || i % 2 === 0 ? v : cx + (v - cx) * k));
const AW = { down: [166, 1.38], up: [158, 1.42] };
function arm(c, kind, m) {
  const base = widen(ARMS[kind], AW[kind][0], AW[kind][1]);
  const ops = m > 0 ? base : mirror(base);
  shapeOps(c, ops, BD.skin, LW, () => { c.fillStyle = BD.shade; c.beginPath(); if (kind === 'down') c.ellipse(m * 190, -680, 14, 230, 0, 0, 7); else c.ellipse(m * 182, -1080, 12, 220, 0, 0, 7); c.fill() });
  if (kind === 'down') {
    stroke(c, [['M', m * 150, -818], ['C', m * 160, -790, m * 164, -762, m * 162, -736]], 2.2);       // biceps
    stroke(c, [['M', m * 174, -678], ['C', m * 180, -656, m * 178, -636, m * 172, -620]], 2);          // forearm
    stroke(c, [['M', m * 166, -462], ['L', m * 168, -480]], 1.8); stroke(c, [['M', m * 178, -460], ['L', m * 180, -480]], 1.8);
    shapeOps(c, [['M', m * 151, -568], ['C', m * 170, -575, m * 192, -575, m * 203, -566], ['L', m * 203, -532], ['C', m * 190, -525, m * 168, -525, m * 150, -532]], BD.wrap, 2.8);
  } else {
    stroke(c, [['M', m * 128, -960], ['C', m * 142, -1000, m * 150, -1040, m * 152, -1070]], 2.2);
    shapeOps(c, [['M', m * 131, -1214], ['C', m * 148, -1221, m * 172, -1221, m * 185, -1214], ['L', m * 182, -1180], ['C', m * 168, -1173, m * 146, -1173, m * 131, -1180]], BD.wrap, 2.8);
  }
}
// ---------- head (centre 0,0; about 150 tall incl. hair) ----------
// expr: happy (default), smile, focused, surprised, tired, determined, laugh
export function bdHead(o = {}) {
  const c = ctx(), e = o.expr || 'happy', look = o.look || [0, 0];
  c.save(); if (o.tilt) c.rotate(o.tilt);
  for (const m of [-1, 1]) shapeOps(c, [['M', m * 52, -10], ['C', m * 68, -20, m * 74, 8, m * 66, 22], ['C', m * 62, 32, m * 54, 30, m * 50, 24]], BD.skin, 3, () => { c.fillStyle = BD.shade; c.beginPath(); c.ellipse(m * 60, 8, 5, 10, 0, 0, 7); c.fill() });
  const HEAD = [['M', 0, -74], ['C', 34, -74, 56, -50, 56, -12], ['C', 56, 22, 48, 46, 34, 60], ['C', 24, 70, 12, 74, 0, 74], ['C', -12, 74, -24, 70, -34, 60], ['C', -48, 46, -56, 22, -56, -12], ['C', -56, -50, -34, -74, 0, -74]];
  shapeOps(c, HEAD, BD.skin, LW, () => { c.fillStyle = BD.shade; c.beginPath(); c.ellipse(50, 12, 12, 70, -.08, 0, 7); c.fill() });
  // hair: short, neat, a soft side-swept quiff
  shapeOps(c, [['M', -57, -6], ['C', -64, -50, -40, -92, 2, -94], ['C', 30, -96, 54, -84, 62, -56], ['C', 66, -40, 62, -22, 57, -8],
    ['C', 54, -26, 48, -38, 38, -44], ['C', 24, -40, 4, -42, -12, -48], ['C', -24, -40, -38, -38, -46, -34], ['C', -52, -26, -55, -16, -57, -6]], BD.hair, 3.5,
    () => { c.strokeStyle = BD.hairHi; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(-20, -78); c.quadraticCurveTo(10, -90, 40, -76); c.stroke(); c.beginPath(); c.moveTo(-34, -60); c.quadraticCurveTo(-6, -72, 22, -64); c.stroke() });
  // eyes
  const E = { happy: { h: 15, lid: 0, br: 4, up: 0 }, smile: { h: 14, lid: 0, br: 2, up: 0 }, focused: { h: 12, lid: .15, br: -2, up: 0 }, surprised: { h: 18, lid: 0, br: 8, up: 6 }, tired: { h: 12, lid: .5, br: 0, up: 0 }, determined: { h: 13, lid: .1, br: -6, up: 0 }, laugh: { h: 0, lid: 0, br: 5, up: 0 } }[e] || { h: 15, lid: 0, br: 4, up: 0 };
  for (const m of [-1, 1]) {
    const x = m * 21, y = -6;
    if (E.h === 0) { stroke(c, [['M', x - 11, y + 2], ['Q', x, y - 10, x + 11, y + 2]], 3.5); }
    else {
      c.beginPath(); c.ellipse(x, y, 12, E.h, 0, 0, 7); c.fillStyle = '#FFFFFF'; c.fill();
      c.save(); c.beginPath(); c.ellipse(x, y, 12, E.h, 0, 0, 7); c.clip();
      c.fillStyle = '#3B2414'; c.beginPath(); c.arc(x + look[0] * 4, y + 1 + look[1] * 4, 7.5, 0, 7); c.fill();
      c.fillStyle = '#120a06'; c.beginPath(); c.arc(x + look[0] * 4, y + 1 + look[1] * 4, 4, 0, 7); c.fill();
      c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(x + look[0] * 4 - 2.5, y - 2 + look[1] * 4, 2.4, 0, 7); c.fill();
      if (E.lid > 0) { c.fillStyle = BD.skin; c.fillRect(x - 14, y - E.h - 2, 28, (2 * E.h + 4) * E.lid) }
      c.restore();
      c.beginPath(); c.ellipse(x, y, 12, E.h, 0, 0, 7); c.lineWidth = 3; c.strokeStyle = BD.line; c.stroke();
      if (E.lid > 0) stroke(c, [['M', x - 12, y - E.h + 2 * E.h * E.lid], ['L', x + 12, y - E.h + 2 * E.h * E.lid]], 3);
    }
    // brows: soft arch; E.br >0 raised/happy, <0 lowered inner end (determined)
    const by = y - Math.max(E.h, 12) - 10 - E.up;
    shapeOps(c, [['M', x - m * 14, by + (E.br < 0 ? -E.br : 0)], ['Q', x, by - 6 - Math.max(0, E.br), x + m * 15, by + 2], ['Q', x, by - 1 - Math.max(0, E.br), x - m * 14, by + 4 + (E.br < 0 ? -E.br : 0)]], BD.hair, 1.5);
  }
  // nose
  stroke(c, [['M', 2, 4], ['C', 9, 14, 9, 21, 0, 23]], 2.6);
  // cheeks
  c.save(); c.globalAlpha = .22; c.fillStyle = BD.blush; c.beginPath(); c.ellipse(-32, 20, 11, 6, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(32, 20, 11, 6, 0, 0, 7); c.fill(); c.restore();
  // mouth
  const t = o.talk || 0;
  if (t > .1) shapeOps(c, [['M', -16, 38], ['C', -8, 36, 8, 36, 16, 38], ['C', 12, 46 + t * 14, -12, 46 + t * 14, -16, 38]], BD.mouth, 2.6, () => { c.fillStyle = BD.tongue; c.beginPath(); c.ellipse(0, 46 + t * 12, 9, 5, 0, 0, 7); c.fill() });
  else if (e === 'happy' || e === 'laugh') shapeOps(c, [['M', -20, 36], ['C', -8, 38, 8, 38, 20, 36], ['C', 16, 58, -16, 58, -20, 36]], BD.mouth, 2.6, () => { c.fillStyle = '#FFFFFF'; c.fillRect(-20, 34, 40, 7); c.fillStyle = BD.tongue; c.beginPath(); c.ellipse(0, 52, 10, 6, 0, 0, 7); c.fill() });
  else if (e === 'surprised') shapeOps(c, [['M', -8, 42], ['C', -8, 30, 8, 30, 8, 42], ['C', 8, 54, -8, 54, -8, 42]], BD.mouth, 2.6);
  else if (e === 'tired') stroke(c, [['M', -12, 42], ['C', -4, 39, 4, 39, 12, 42]], 3);
  else stroke(c, [['M', -16, 38], ['C', -6, 46, 8, 46, 18, 36]], 3);
  if (o.sweat) shapeOps(c, [['M', 58, -40], ['C', 68, -22, 62, -12, 56, -14], ['C', 48, -18, 50, -28, 58, -40]], '#BFE6F7', 2.4);
  c.restore();
}
function anatomy(c) {
  both(c, [['M', 24, -916], ['C', 60, -908, 100, -904, 132, -898]], 2);       // collarbones
  stroke(c, [['M', 0, -904], ['L', 0, -812]], 2.2);                         // sternum
  both(c, [['M', 6, -810], ['C', 44, -792, 98, -798, 130, -832]], 2.8);       // lower pec
  both(c, [['M', 132, -872], ['C', 116, -856, 108, -838, 112, -820]], 2);     // pec / deltoid groove
  stroke(c, [['M', 0, -800], ['L', 0, -668]], 2.2);                         // linea alba
  for (const y of [-768, -732, -697]) both(c, [['M', 5, y], ['C', 22, y - 6, 38, y - 5, 48, y + 2]], 2.2); // abs
  both(c, [['M', 52, -806], ['C', 60, -760, 58, -712, 48, -672]], 2.2);       // outer edge of the abs
  for (const y of [-792, -766, -740]) both(c, [['M', 104, y], ['L', 92, y + 10]], 1.8); // serratus
  both(c, [['M', 80, -412], ['C', 62, -404, 54, -386, 58, -366]], 2.2);       // teardrop quad
  both(c, [['M', 104, -428], ['C', 96, -404, 92, -384, 94, -362]], 1.8);      // outer quad
  both(c, [['M', 52, -298], ['C', 60, -290, 78, -290, 86, -298]], 1.8);       // kneecap
  both(c, [['M', 100, -248], ['C', 94, -214, 90, -184, 86, -160]], 2);        // calf split
  both(c, [['M', 46, -236], ['C', 44, -206, 44, -176, 48, -150]], 1.8);       // inner calf
  both(c, [['M', 60, -8], ['L', 62, 0]], 1.8); both(c, [['M', 74, -10], ['L', 76, 0]], 1.8); both(c, [['M', 88, -12], ['L', 90, 0]], 1.8);
}
// o: x, y, s, pose: 'stand' | 'hang', expr, talk, look:[x,y], tilt, sweat
export function brownDude(o) {
  const c = ctx(), s = o.s || 1, pose = o.pose || 'stand';
  c.save(); c.translate(o.x, o.y); c.scale(s, s);
  if (!o.noShadow && pose !== 'hang') { c.save(); c.globalAlpha = .14; c.fillStyle = '#1e1a22'; c.beginPath(); c.ellipse(0, 6, 150, 16, 0, 0, 7); c.fill(); c.restore() }
  const k = pose === 'hang' ? 'up' : 'down';
  arm(c, k, 1); arm(c, k, -1);                                   // arms first, behind the body
  shapeOps(c, BODY, BD.skin, LW, () => {
    c.fillStyle = BD.shade; c.beginPath(); trace(c, [['M', 150, -900], ['C', 196, -860, 150, -740, 108, -680], ['C', 120, -600, 140, -480, 114, -340], ['C', 128, -250, 116, -130, 92, -50], ['L', 300, 0], ['L', 300, -1000]]); c.closePath(); c.fill();
    c.fillStyle = BD.hi; c.beginPath(); c.ellipse(-62, -860, 34, 14, -.3, 0, 7); c.fill();
  });
  anatomy(c);
  shapeOps(c, SHORTS, BD.shorts, LW, () => { c.fillStyle = BD.shortsShade; c.beginPath(); trace(c, [['M', 86, -660], ['C', 120, -600, 130, -520, 126, -444], ['L', 300, -444], ['L', 300, -660]]); c.closePath(); c.fill() });
  shapeOps(c, [['M', -95, -660], ['L', 95, -660], ['L', 98, -638], ['L', -98, -638]], BD.band, 3);
  both(c, [['M', 26, -630], ['C', 20, -596, 12, -572, 5, -560]], 2.2);
  both(c, [['M', 112, -590], ['C', 122, -546, 124, -500, 118, -456]], 2);
  stroke(c, [['M', -18, -956], ['C', -14, -942, -8, -934, 0, -930]], 2);
  c.save(); c.translate(0, -1036); c.scale(1.04, 1.04); bdHead(o); c.restore();
  c.restore();
}
export function plate(col = '#D7E4EE') { const c = ctx(); c.fillStyle = col; c.fillRect(-2000, -2000, 6000, 6000) }
export const PLATES = { blue: '#D7E4EE', cream: '#FCEFD9', lilac: '#D9D0EE', mint: '#D6EEDF', peach: '#F8DCCB' };
