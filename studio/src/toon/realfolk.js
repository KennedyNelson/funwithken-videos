// Realistic-proportion people in the Flat Vector style (pack: flat-vector.md): no outlines, 2-3 flat tone planes per shape,
// smooth curves, natural anatomy. Seated side/three-quarter view facing RIGHT (mirror with flip for facing left).
// Local origin: the hip point on the seat. Units: about 1 px at s=1, total seated height ~640.
import { ctx, clamp, lerp, dark, light } from './toon.js';
const R = { };
function P(c, pts) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) { const p = pts[i]; if (p.length === 6) c.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]); else if (p.length === 4) c.quadraticCurveTo(p[0], p[1], p[2], p[3]); else c.lineTo(p[0], p[1]) } c.closePath() }
function fill(c, pts, col) { P(c, pts); c.fillStyle = col; c.fill() }
function clipFill(c, pts, fn) { c.save(); P(c, pts); c.clip(); fn(); c.restore() }
const dir = a => [Math.sin(a), Math.cos(a)];           // angle from straight down, + toward the face direction
const deg = d => d * Math.PI / 180;
// limb: a smooth tapered capsule (two overlapping round-capped strokes, no outline, so joints read as one continuous form)
function limb(c, a, b, wa, wb, col) {
  c.lineCap = 'round'; c.strokeStyle = col;
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  c.lineWidth = wa * 2; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(m[0], m[1]); c.stroke();
  c.lineWidth = (wa + wb); c.beginPath(); c.moveTo(m[0], m[1]); c.lineTo(b[0], b[1]); c.stroke();
  c.lineWidth = wb * 2; c.beginPath(); c.moveTo((m[0] + b[0]) / 2, (m[1] + b[1]) / 2); c.lineTo(b[0], b[1]); c.stroke();
}
// ---------- head in profile/three-quarter, facing right. centre ~ (0,0), height ~230 ----------
export function headSide(o) {
  const c = ctx(), sk = o.skin, sh = dark(sk, .16), hl = light(sk, .12), f = o.face || {};
  c.save(); if (o.tilt) c.rotate(o.tilt);
  // neck (behind the jaw)
  fill(c, [[-34, 60], [30, 70], [36, 150], [-40, 150]], sh);
  const HEAD = [[-92, -12], [-96, -86, -40, -128, 18, -126], [72, -124, 100, -82, 98, -44], [100, -32, 96, -26, 98, -20], [112, -2, 126, 10, 124, 18], [118, 26, 106, 28, 104, 30], [110, 36, 108, 44, 104, 46], [110, 52, 106, 60, 100, 62], [104, 74, 98, 86, 86, 92], [66, 106, 30, 104, 4, 92], [-30, 80, -60, 70, -76, 52], [-92, 34, -94, 10, -92, -12]];
  fill(c, HEAD, sk);
  clipFill(c, HEAD, () => { c.fillStyle = sh; c.beginPath(); c.ellipse(-60, 10, 60, 120, 0, 0, 7); c.fill(); c.fillStyle = hl; c.beginPath(); c.ellipse(70, -70, 26, 18, -.3, 0, 7); c.fill();
     });
  // ear
  fill(c, [[-14, -18], [8, -24, 10, 4, 2, 22], [-4, 34, -22, 30, -24, 14], [-28, -2, -24, -14, -14, -18]], sk);
  fill(c, [[-8, -8], [0, -10, 2, 6, -2, 16], [-8, 20, -16, 14, -14, 4]], sh);
  // nose shade + nostril
  fill(c, [[98, -18], [112, 0, 120, 12, 118, 18], [110, 22, 104, 24, 100, 22]], dark(sk, .08));
  c.fillStyle = dark(sk, .35); c.beginPath(); c.ellipse(106, 24, 5, 2.5, -.3, 0, 7); c.fill();
  // eye
  const ex = 64, ey = -18, lid = clamp(f.lid || 0, 0, 1), look = f.look || 0;
  if (f.closed) { c.strokeStyle = '#1b1210'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(ex - 14, ey + 2); c.quadraticCurveTo(ex + 2, ey + 9, ex + 18, ey + 1); c.stroke() }
  else {
    const EYE = [[ex - 14, ey + 1], [ex - 4, ey - 10, ex + 12, ey - 9, ex + 20, ey - 1], [ex + 12, ey + 6, ex - 4, ey + 7, ex - 14, ey + 1]];
    fill(c, EYE, '#F7F3EE');
    clipFill(c, EYE, () => { c.fillStyle = '#3A2414'; c.beginPath(); c.arc(ex + 9 + look * 3, ey - 1, 7.5, 0, 7); c.fill(); c.fillStyle = '#0f0906'; c.beginPath(); c.arc(ex + 10 + look * 3, ey - 1, 3.6, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(ex + 7 + look * 3, ey - 4, 2, 0, 7); c.fill();
      if (lid > 0) { c.fillStyle = sk; c.fillRect(ex - 16, ey - 12, 40, 20 * lid) } });
    c.strokeStyle = '#1b1210'; c.lineWidth = 3.4; c.lineCap = 'round'; c.beginPath(); c.moveTo(ex - 14, ey + 1 - 1); c.bezierCurveTo(ex - 4, ey - 11, ex + 12, ey - 10, ex + 21, ey - 1); c.stroke();
  }
  // brow
  const bu = f.brow || 0;
  fill(c, [[ex - 20, ey - 22 + bu * 2], [ex - 2, ey - 34 - bu * 5, ex + 18, ey - 32 - bu * 5, ex + 30, ey - 24 - bu * 2], [ex + 28, ey - 19 - bu * 2], [ex + 14, ey - 25 - bu * 4, ex - 2, ey - 26 - bu * 4, ex - 18, ey - 16 + bu * 2]], o.hair);
  // mouth
  const op = clamp(f.open || 0, 0, 1), sm = f.smile || 0;
  if (op > .05) { fill(c, [[86, 46 - sm * 3], [96, 40 - sm * 2, 108, 42, 108, 46], [106, 50 + op * 16, 92, 52 + op * 18, 86, 46 - sm * 3]], '#4A1A16'); if (op > .35) fill(c, [[92, 44], [100, 42, 106, 43, 106, 45], [100, 47, 94, 47, 92, 44]], '#F4EEE8') }
  else { c.strokeStyle = dark(sk, .45); c.lineWidth = 3.2; c.lineCap = 'round'; c.beginPath(); c.moveTo(86, 47 - sm * 5); c.quadraticCurveTo(96, 49 + sm * 4, 107, 45 - sm * 2); c.stroke() }
  if (sm > .3) { c.strokeStyle = dark(sk, .3); c.lineWidth = 2.4; c.beginPath(); c.moveTo(80, 34); c.quadraticCurveTo(78, 44, 82, 52); c.stroke() }
  // hair: neat modern cut, volume on top, short sides
  const HAIR = [[86, -76], [94, -110, 60, -150, 4, -150], [-52, -150, -96, -120, -100, -60], [-102, -20, -96, 18, -84, 40], [-78, 22, -76, 0, -66, -18], [-40, -30, -22, -30, -12, -40], [8, -60, 40, -66, 70, -64], [78, -66, 84, -70, 86, -76]];
  fill(c, HAIR, o.hair);
  clipFill(c, HAIR, () => { c.fillStyle = light(o.hair, .12); c.beginPath(); c.ellipse(10, -132, 60, 12, -.08, 0, 7); c.fill(); c.fillStyle = light(o.hair, .06); c.beginPath(); c.ellipse(-50, -100, 30, 8, -.5, 0, 7); c.fill() });
  fill(c, [[-6, -38], [4, -42, 8, -30, 6, -16], [0, -14, -6, -24, -6, -38]], o.hair);    // sideburn
  c.restore();
}
// ---------- seated person facing right ----------
// o: x,y (hip on the seat), s, flip, skin, hair, shirt, pant, shoe, stubble, face, lean, headTilt, arms: {near:[a1,a2,hand], far:[a1,a2,hand]} in degrees
export function seated(o) {
  const c = ctx(), s = o.s || 1, sk = o.skin, sh = o.shirt, shD = dark(sh, .18), pa = o.pant, paD = dark(pa, .2);
  c.save(); c.translate(o.x, o.y); c.scale(s * (o.flip ? -1 : 1), s);
  const lean = o.lean || 0;
  // far leg (behind)
  const legs = (k, col, colD, shoe) => { const hip = [10 * k, 0], knee = [230, -6 + 6 * k], ank = [238 - 6 * k, 250];
    limb(c, knee, ank, 30, 22, col); limb(c, hip, knee, 52, 34, col); c.fillStyle = colD; c.beginPath(); c.ellipse(120, 20, 110, 14, 0, 0, 7); c.globalAlpha = .4; c.fill(); c.globalAlpha = 1;
    fill(c, [[ank[0] - 30, ank[1] - 6], [ank[0] + 54, ank[1] - 8, ank[0] + 74, ank[1] + 8, ank[0] + 72, ank[1] + 22], [ank[0] - 32, ank[1] + 22]], shoe); fill(c, [[ank[0] - 32, ank[1] + 16], [ank[0] + 72, ank[1] + 16], [ank[0] + 72, ank[1] + 22], [ank[0] - 32, ank[1] + 22]], dark(shoe, .25)) };
  legs(-1, paD, dark(paD, .2), dark(o.shoe, .15));
  // far arm
  const shoulder = [lean * 40 + 6, -282];
  const arm = (pose, col, skc, far) => { const [a1, a2, hand] = pose; const d1 = dir(deg(a1)), el = [shoulder[0] + d1[0] * 150, shoulder[1] + d1[1] * 150]; const d2 = dir(deg(a1 + a2)), wr = [el[0] + d2[0] * 136, el[1] + d2[1] * 136];
    limb(c, el, wr, 25, 19, col); limb(c, shoulder, el, 33, 26, col);
    fill(c, [[wr[0] - d2[0] * 10 - d2[1] * 20, wr[1] - d2[1] * 10 + d2[0] * 20], [wr[0] - d2[0] * 10 + d2[1] * 20, wr[1] - d2[1] * 10 - d2[0] * 20], [wr[0] - d2[0] * 18 + d2[1] * 21, wr[1] - d2[1] * 18 - d2[0] * 21], [wr[0] - d2[0] * 18 - d2[1] * 21, wr[1] - d2[1] * 18 + d2[0] * 21]], dark(col, .12));   // cuff
    const ha = Math.atan2(d2[1], d2[0]); c.save(); c.translate(wr[0], wr[1]); c.rotate(ha - Math.PI / 2);
    if (hand === 'open') { fill(c, [[-18, -4], [18, -4], [24, 34, 8, 58, -4, 58], [-16, 54, -22, 30, -18, -4]], skc); fill(c, [[-18, 4], [-30, 18, -32, 30, -26, 34], [-18, 26, -14, 16, -18, 4]], skc) }
    else if (hand === 'point') { fill(c, [[-18, -4], [18, -4], [22, 22, 14, 34, 0, 34], [-16, 32, -22, 18, -18, -4]], skc); fill(c, [[2, 26], [8, 26], [10, 70], [2, 70]], skc) }
    else { fill(c, [[-19, -4], [19, -4], [24, 22, 14, 38, 0, 38], [-16, 36, -24, 18, -19, -4]], skc); c.fillStyle = dark(skc, .14); c.fillRect(-14, 22, 28, 4) }
    c.restore(); return wr };
  arm(o.arms ? o.arms.far : [30, 70, 'fist'], shD, dark(sk, .12), true);
  // torso (leaning)
  c.save(); c.rotate(lean);
  const TORSO = [[-64, 6], [-70, -120, -64, -230, -40, -290], [-14, -312, 34, -312, 58, -296], [84, -250, 86, -150, 72, -70], [66, -30, 64, -6, 56, 10]];
  fill(c, TORSO, sh);
  clipFill(c, TORSO, () => { c.fillStyle = shD; c.beginPath(); c.ellipse(-56, -150, 40, 190, 0, 0, 7); c.fill(); c.fillStyle = dark(sh, .08); c.fillRect(-70, -40, 160, 50);
    c.strokeStyle = dark(sh, .14); c.lineWidth = 3; c.beginPath(); c.moveTo(40, -270); c.lineTo(46, -40); c.stroke();     // placket
    for (let i = 0; i < 4; i++) { c.fillStyle = dark(sh, .3); c.beginPath(); c.arc(43 + i * 1.2, -240 + i * 56, 3.4, 0, 7); c.fill() }
    c.strokeStyle = dark(sh, .1); c.lineWidth = 2.5; c.beginPath(); c.moveTo(-20, -200); c.quadraticCurveTo(10, -150, 0, -90); c.stroke() });
  // belt line
  fill(c, [[-62, -6], [62, -14], [64, 2], [-64, 10]], dark(pa, .35));
  // collar
  fill(c, [[4, -308], [30, -306], [40, -290], [24, -292]], light(sh, .06)); fill(c, [[4, -308], [-8, -300], [-12, -288], [4, -294]], dark(sh, .06));
  // head
  c.save(); c.translate(shoulder[0] + 4, -392); c.rotate(o.headTilt || 0); c.scale(.66, .66); headSide(o); c.restore();
  c.restore();
  // near leg (front)
  legs(1, pa, paD, o.shoe);
  // near arm (front)
  arm(o.arms ? o.arms.near : [24, 64, 'fist'], sh, sk, false);
  c.restore();
}
// plain chair (side view), facing right; origin = seat point under the hip
export function chairSide(x, y, s, flip, col = '#4A4F57') {
  const c = ctx(); c.save(); c.translate(x, y); c.scale(s * (flip ? -1 : 1), s);
  const d = dark(col, .2);
  fill(c, [[-110, 30], [-120, -230, -110, -330, -86, -360], [-62, -362], [-74, -300, -78, -120, -72, 24]], d);   // backrest
  fill(c, [[-96, 18], [150, 12], [156, 44], [-100, 48]], col);                                                  // seat
  for (const [x0, x1] of [[-80, -96], [130, 146]]) fill(c, [[x0, 44], [x0 + 14, 44], [x1 + 14, 300], [x1, 300]], d);
  c.restore();
}
