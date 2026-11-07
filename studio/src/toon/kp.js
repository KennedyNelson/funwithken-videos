// "Desi Goggle-Eye Toon" (our name; grammar learned from the kp_animatess reels, 2026-11-08). Clean dark outlines,
// flat colours with one soft shadow tone, BIG round head, huge white goggle eyes that touch, thick black brows, small
// nose curve, small expressive mouth with teeth, normal-proportion body in everyday clothes. Every limb is ONE continuous
// outlined tube (no joints); sleeves and trousers cover the roots so nothing looks bolted on.
import { ctx, clamp, lerp, dark, light } from './toon.js';
const INK = '#1E1814', LW = 5;
// ---------- primitives ----------
function path(c, pts, closed = true) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) { const p = pts[i]; if (p.length === 6) c.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]); else if (p.length === 4) c.quadraticCurveTo(p[0], p[1], p[2], p[3]); else c.lineTo(p[0], p[1]) } if (closed) c.closePath() }
function shape(c, pts, fill, lw = LW, shade) { path(c, pts); c.fillStyle = fill; c.fill(); if (shade) { c.save(); path(c, pts); c.clip(); shade(); c.restore() } if (lw) { path(c, pts); c.lineWidth = lw; c.strokeStyle = INK; c.lineJoin = 'round'; c.stroke() } }
function line(c, pts, lw = 4, col = INK) { path(c, pts, false); c.lineWidth = lw; c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke() }
function ell(c, x, y, rx, ry, fill, lw = LW, rot = 0) { c.beginPath(); c.ellipse(x, y, Math.max(.5, rx), Math.max(.5, ry), rot, 0, 7); if (fill) { c.fillStyle = fill; c.fill() } if (lw) { c.lineWidth = lw; c.strokeStyle = INK; c.stroke() } }
// smooth closed curve through points (quadratic through midpoints)
function smoothPath(c, P) { const n = P.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; c.beginPath(); const s = m(P[n - 1], P[0]); c.moveTo(s[0], s[1]); for (let i = 0; i < n; i++) { const e = m(P[i], P[(i + 1) % n]); c.quadraticCurveTo(P[i][0], P[i][1], e[0], e[1]) } c.closePath() }
// continuous tube along a polyline with per-point half-widths; openStart hides the start cap outline (it merges into a sleeve/torso)
export function tube(c, pts, ws, fill, o = {}) {
  const n = pts.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)]; let dx = b[0] - a[0], dy = b[1] - a[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    L.push([pts[i][0] - dy * ws[i], pts[i][1] + dx * ws[i]]); R.push([pts[i][0] + dy * ws[i], pts[i][1] - dx * ws[i]]);
  }
  const e = pts[n - 1], s = pts[0], ae = Math.atan2(L[n - 1][1] - e[1], L[n - 1][0] - e[0]), as = Math.atan2(R[0][1] - s[1], R[0][0] - s[0]);
  const curve = (arr, first) => { if (first) c.moveTo(arr[0][0], arr[0][1]); for (let i = 1; i < arr.length - 1; i++) { const mx = (arr[i][0] + arr[i + 1][0]) / 2, my = (arr[i][1] + arr[i + 1][1]) / 2; c.quadraticCurveTo(arr[i][0], arr[i][1], mx, my) } c.lineTo(arr[arr.length - 1][0], arr[arr.length - 1][1]) };
  const build = (withStart) => { c.beginPath(); curve(L, true); c.arc(e[0], e[1], ws[n - 1], ae, ae - Math.PI, true); curve([...R].reverse(), false); if (withStart) c.arc(s[0], s[1], ws[0], as, as - Math.PI, true) };
  build(true); c.closePath(); c.fillStyle = fill; c.fill();
  if (o.shade) { c.save(); build(true); c.closePath(); c.clip(); o.shade(L, R); c.restore() }
  build(!o.openStart); if (!o.openStart) c.closePath(); c.lineWidth = o.lw || LW; c.strokeStyle = INK; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke();
}
// ---------- head ----------
// o: r, skin, hair:'kalu'|'battery', hairCol, specs, turn (-1..1, + looks to screen-right), f: {brow, browUp, lid, closed:'happy'|'flat', look:[x,y], mouth, open, teeth, tears, blush}
export function kpHead(o) {
  const c = ctx(), r = o.r || 120, sk = o.skin, sh = dark(sk, .14), tn = clamp(o.turn || 0, -1, 1), f = o.face || {};
  const fx = tn * r * .3;                                        // feature offset toward the look direction
  c.save(); if (o.tilt) c.rotate(o.tilt);
  // back hair mass (behind head)
  if (o.hair === 'battery') smoothPathFill(c, [[-r * 1.02, -r * .2], [-r * .9, -r * 1.0], [0, -r * 1.22], [r * .9, -r * 1.0], [r * 1.04, -r * .2], [r * .95, r * .1], [-r * .95, r * .1]], o.hairCol);
  // ear on the side away from the look
  const ex = -Math.sign(tn || .001) * r * .95; if (Math.abs(tn) > .1) { ell(c, ex, r * .05, r * .16, r * .22, sk); line(c, [[ex + Math.sign(tn) * r * .02, -r * .05], [ex - Math.sign(tn) * r * .05, r * .08, ex + Math.sign(tn) * r * .03, r * .14]], 3, sh) }
  // skull + cheeks + chin (slightly wider low, kp-like)
  const H = [[0, -r], [r * .78, -r * .98, r, -r * .5, r * .98, -r * .05], [r * .96, r * .45, r * .66, r * .9, fx * .4, r * .94], [-r * .66, r * .9, -r * .96, r * .45, -r * .98, -r * .05], [-r, -r * .5, -r * .78, -r * .98, 0, -r]];
  shape(c, H, sk, LW, () => { c.fillStyle = sh; c.beginPath(); c.ellipse(-Math.sign(tn || 1) * r * .82, r * .25, r * .3, r * .9, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(fx * .4, r * .95, r * .55, r * .14, 0, 0, 7); c.fill();
    if (o.stubble) { c.globalAlpha = .13; c.fillStyle = '#1a120c'; c.beginPath(); c.ellipse(fx * .5, r * .62, r * .62, r * .3, 0, 0, 7); c.fill(); c.globalAlpha = 1 } });
  if (f.blush) { c.save(); c.globalAlpha = .25; c.fillStyle = '#E25E5E'; c.beginPath(); c.ellipse(fx - r * .52, r * .32, r * .17, r * .08, 0, 0, 7); c.ellipse(fx + r * .52, r * .32, r * .17, r * .08, 0, 0, 7); c.fill(); c.restore() }
  // eyes: two big white goggles that touch; far eye narrower when turned
  const ey = -r * .14 - (f.browUp || 0) * 2, look = f.look || [tn * .7, 0];
  const sep = o.specs ? .36 : .3, ew = o.specs ? .29 : .34;
  const E = [[fx - r * sep, r * ew * (1 - Math.max(0, tn) * .18)], [fx + r * sep, r * ew * (1 - Math.max(0, -tn) * .18)]];
  const eh = r * .38 * (f.eye || 1);
  for (const [x, w] of E) {
    if (f.closed === 'happy') { line(c, [[x - w * .75, ey + eh * .15], [x, ey - eh * .55, x + w * .75, ey + eh * .15]], 6); continue }
    if (f.closed === 'flat') { line(c, [[x - w * .75, ey + eh * .05], [x, ey + eh * .25, x + w * .75, ey + eh * .05]], 6); continue }
    ell(c, x, ey, w, eh, '#FFFFFF', 5);
    c.save(); c.beginPath(); c.ellipse(x, ey, w - 2, eh - 2, 0, 0, 7); c.clip();
    const pr = r * .085 * (f.pupil || 1), px = x + look[0] * w * .55, py = ey + look[1] * eh * .55;
    c.fillStyle = '#16100C'; c.beginPath(); c.arc(px, py, pr, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(px - pr * .35, py - pr * .4, pr * .32, 0, 7); c.fill();
    if (f.tears) { c.globalAlpha = .55; c.fillStyle = '#9ED6F3'; c.beginPath(); c.ellipse(x, ey + eh * .85, w * .95, eh * .35, 0, 0, 7); c.fill(); c.globalAlpha = 1 }
    const lid = clamp(f.lid || 0, 0, 1); if (lid > 0) { c.fillStyle = sk; c.fillRect(x - w - 4, ey - eh - 4, 2 * w + 8, (2 * eh + 8) * lid * .9); c.restore(); line(c, [[x - w * .98, ey - eh + 2 * eh * lid * .9], [x, ey - eh + 2 * eh * lid * .9 + 4, x + w * .98, ey - eh + 2 * eh * lid * .9]], 5) } else c.restore();
  }
  // specs (Battery)
  if (o.specs) { c.lineWidth = 7; c.strokeStyle = '#2A2420'; for (const [x, w] of E) { c.beginPath(); c.ellipse(x, ey, w + 9, eh * .82 + 9, 0, 0, 7); c.stroke() } line(c, [[E[0][0] + E[0][1] + 6, ey - eh * .25], [E[1][0] - E[1][1] - 6, ey - eh * .25]], 6, '#2A2420') }
  // brows: thick, sit on the eye tops; brow>0 worried/raised inner, <0 angry
  const b = f.brow || 0;
  for (const [i, [x, w]] of E.entries()) {
    const q = i === 0 ? -1 : 1, by = ey - eh - (o.specs ? 22 : 14) - (f.browUp || 0) * 6;
    const inner = [x - q * w * .85, by + (b < 0 ? -b * 14 : -b * 12)], outer = [x + q * w * .85, by + (b > 0 ? b * 6 : b * 4) + 4];
    c.lineWidth = r * .1; c.lineCap = 'round'; c.strokeStyle = o.browCol || '#14100D'; c.beginPath(); c.moveTo(inner[0], inner[1]); c.quadraticCurveTo(x, by - 10, outer[0], outer[1]); c.stroke();
  }
  // nose: small curve toward the look side
  line(c, [[fx + tn * r * .14 - r * .02, r * .2], [fx + tn * r * .2 + r * .1, r * .33, fx + tn * r * .1, r * .38]], 4.5, dark(sk, .45));
  // mouth
  mouth(c, fx + tn * r * .06, r * .6, r, f, sk);
  // hair (front)
  if (o.hair === 'kalu') {
    shape(c, [[-r * .98, -r * .1], [-r * 1.08, -r * .8, -r * .45, -r * 1.2, r * .1, -r * 1.14], [r * .7, -r * 1.12, r * 1.06, -r * .76, r * 1.0, -r * .12], [r * .86, -r * .46], [r * .62, -r * .34], [r * .52, -r * .62], [r * .22, -r * .42], [r * .06, -r * .72], [-r * .22, -r * .46], [-r * .4, -r * .74], [-r * .62, -r * .42], [-r * .8, -r * .58]], o.hairCol, LW,
      () => { c.fillStyle = light(o.hairCol, .14); c.beginPath(); c.ellipse(-r * .1, -r * .98, r * .45, r * .08, -.15, 0, 7); c.fill() });
  } else if (o.hair === 'battery') {
    shape(c, [[-r * 1.0, -r * .12], [-r * 1.06, -r * .9, -r * .2, -r * 1.24, r * .5, -r * 1.06], [r * 1.0, -r * .9, r * 1.08, -r * .4, r * 1.0, -r * .1], [r * .9, -r * .5, r * .5, -r * .66, r * .1, -r * .6], [-r * .3, -r * .74, -r * .7, -r * .6, -r * .86, -r * .36]], o.hairCol, LW,
      () => { c.fillStyle = light(o.hairCol, .14); c.beginPath(); c.ellipse(r * .2, -r * .98, r * .5, r * .08, .1, 0, 7); c.fill(); line(c, [[-r * .35, -r * 1.05], [-r * .1, -r * .78, r * .1, -r * .66]], 3, light(o.hairCol, .2)) });
  }
  c.restore();
}
function smoothPathFill(c, P, col) { smoothPath(c, P); c.fillStyle = col; c.fill(); c.lineWidth = LW; c.strokeStyle = INK; c.stroke() }
function mouth(c, x, y, r, f, sk) {
  const m = f.mouth || 'smile', op = clamp(f.open == null ? .5 : f.open, 0, 1), w = r * (f.wide || .28);
  if (m === 'smile') line(c, [[x - w * .8, y - 4], [x, y + r * .12, x + w * .8, y - 4]], 5);
  else if (m === 'smirk') line(c, [[x - w * .6, y + 2], [x + w * .2, y + r * .06, x + w * .85, y - r * .08]], 5);
  else if (m === 'flat') line(c, [[x - w * .55, y + 2], [x + w * .55, y + 2]], 5);
  else if (m === 'sad') line(c, [[x - w * .6, y + r * .08], [x, y - r * .04, x + w * .6, y + r * .08]], 5);
  else if (m === 'o') ell(c, x, y + r * .04, r * .09, r * .12 * (.5 + op * .7), '#5A1717', 5);
  else if (m === 'grit') { shape(c, [[x - w, y - r * .08], [x + w, y - r * .08], [x + w * .9, y + r * .12], [x - w * .9, y + r * .12]], '#FFFFFF', 5); line(c, [[x - w * .95, y + r * .02], [x + w * .95, y + r * .02]], 3); for (const t of [-.5, 0, .5]) line(c, [[x + t * w, y - r * .08], [x + t * w, y + r * .12]], 3) }
  else { // talking / open / laugh / teeth: open shape, upper teeth strip, tongue
    const hh = r * (m === 'laugh' ? .3 : .22) * (.25 + .75 * op), ww = w * (m === 'laugh' ? 1.35 : 1) * (1 + (f.wideNow || 0) * .25);
    const top = y - r * .06;
    shape(c, [[x - ww, top], [x, top - r * .03, x + ww, top], [x + ww * .8, top + hh * 1.2, x, top + hh * 1.5], [x - ww * .8, top + hh * 1.2, x - ww, top]], '#5A1717', 5, () => {
      c.fillStyle = '#FFFFFF'; c.fillRect(x - ww, top - 2, ww * 2, Math.min(hh * .45, r * .07) + 2);
      if (hh > r * .08) { c.fillStyle = '#E06A6A'; c.beginPath(); c.ellipse(x, top + hh * 1.35, ww * .55, hh * .45, 0, 0, 7); c.fill() } });
  }
}
// ---------- seated body, three-quarter, facing screen-right (flip for left). origin = hip on the seat ----------
// o: x,y,s,flip, skin, hair, hairCol, specs, stubble, top:'tee'|'shirt', topCol, pant, shoe, face, turn (head), lean, nod, arms:{near:{e:[x,y],h:[x,y],hand}, far:{...}}
export function kpSeated(o) {
  const c = ctx(), s = o.s || 1, sk = o.skin, tc = o.topCol, td = dark(tc, .16), pc = o.pant, pd = dark(pc, .18);
  c.save(); c.translate(o.x, o.y); c.scale(s * (o.flip ? -1 : 1), s);
  const lean = o.lean || 0, hop = o.hop || 0, st = o.stand || 0, LIFT = 205; c.translate(0, -hop - st * LIFT);
  const L2 = (a, b) => [lerp(a[0], b[0], st), lerp(a[1], b[1], st)];   // stand: legs straighten as the body rises off the seat
  const SH = { near: [-70, -300], far: [78, -312] };
  const armDraw = (k, a, col, scol) => {
    const S = SH[k], e = [S[0] + a.e[0], S[1] + a.e[1]], h = [S[0] + a.h[0], S[1] + a.h[1]];
    // bare arm tube from inside the sleeve to the wrist
    const st = [lerp(S[0], e[0], .35), lerp(S[1], e[1], .35)];
    tube(c, [st, e, h], [24, 21, 17], sk, { openStart: true });
    hand(c, h, Math.atan2(h[1] - e[1], h[0] - e[0]), a.hand || 'rest', sk);
    // sleeve over the root
    if (o.top === 'tee') tube(c, [[S[0], S[1] + 6], [lerp(S[0], e[0], .42), lerp(S[1], e[1], .42)]], [36, 31], scol, { openStart: true });
    else tube(c, [[S[0], S[1] + 6], e, [lerp(e[0], h[0], .78), lerp(e[1], h[1], .78)]], [36, 30, 24], scol, { openStart: true, shade: () => {} });
  };
  // far leg, far arm (behind torso)
  leg(c, [36, -6], L2([212, -24], [62, 215]), L2([226, 232], [70, 437]), pd, dark(o.shoe, .12), 1);
  c.save(); c.rotate(lean); armDraw('far', o.arms.far, sk, td); c.restore();
  // torso (one shape incl. hips and shoulders)
  c.save(); c.rotate(lean);
  const T = [[-112, -6], [-122, -110, -112, -220, -98, -290], [-80, -326, -20, -334, 40, -330], [96, -326, 112, -300, 106, -250], [112, -170, 100, -80, 104, -10], [40, 14, -60, 14, -112, -6]];
  shape(c, T, tc, LW, () => { c.fillStyle = td; c.beginPath(); c.ellipse(96, -150, 40, 220, 0, 0, 7); c.fill(); c.fillStyle = dark(tc, .08); c.fillRect(-130, -70, 260, 90);
    if (o.top === 'shirt') { line(c, [[0, -318], [8, -10]], 4, dark(tc, .3)); for (let i = 0; i < 5; i++) { c.fillStyle = light(tc, .5); c.beginPath(); c.arc(4 + i * 1.6, -282 + i * 62, 5, 0, 7); c.fill() } }
    else line(c, [[-40, -200], [-20, -130, -36, -60]], 3, dark(tc, .2)) });
  // collar / neckline
  if (o.top === 'shirt') { shape(c, [[-46, -330], [0, -300], [-14, -276], [-60, -312]], light(tc, .12), 4); shape(c, [[46, -332], [4, -300], [18, -278], [62, -314]], light(tc, .12), 4) }
  else shape(c, [[-38, -330], [0, -306, 38, -332], [30, -320], [0, -296, -30, -320]], dark(tc, .2), 3);
  // neck
  shape(c, [[-26, -330], [-24, -370], [26, -370], [28, -330], [0, -312, -26, -330]], sk, 4, () => { c.fillStyle = dark(sk, .2); c.fillRect(-30, -372, 60, 22) });
  // head
  c.save(); c.translate(6, -470); c.translate(0, (o.nod || 0) * 18); c.rotate(o.headTilt || 0); kpHead({ r: 128, ...o, turn: o.turn == null ? .55 : o.turn }); c.restore();
  c.restore();
  // near leg (front)
  leg(c, [-40, 2], L2([196, -6], [44, 218]), L2([204, 246], [54, 450]), pc, o.shoe, -1);
  // near arm (front)
  c.save(); c.rotate(lean); armDraw('near', o.arms.near, sk, tc); c.restore();
  c.restore();
}
function leg(c, hip, knee, ank, col, shoe, k) {
  tube(c, [hip, knee, ank], [52, 40, 30], col, { openStart: true, shade: (L, R) => { c.fillStyle = dark(col, .1); c.beginPath(); c.ellipse((hip[0] + knee[0]) / 2, (hip[1] + knee[1]) / 2 + 30, 110, 16, 0, 0, 7); c.fill() } });
  line(c, [[knee[0] - 30, knee[1] + 10], [knee[0] - 6, knee[1] + 30]], 3, dark(col, .25));
  // shoe
  const x = ank[0], y = ank[1];
  shape(c, [[x - 36, y + 10], [x - 34, y - 18], [x + 30, y - 22], [x + 66, y - 6, x + 74, y + 14], [x + 74, y + 26], [x - 38, y + 26]], shoe, 5, () => { c.fillStyle = dark(shoe, .2); c.fillRect(x - 40, y + 16, 120, 12) });
}
function hand(c, p, ang, kind, sk) {
  c.save(); c.translate(p[0], p[1]); c.rotate(ang - Math.PI / 2);
  if (kind === 'open') { shape(c, [[-20, -4], [22, -4], [28, 26, 22, 52, 6, 58], [-12, 58, -26, 44, -22, 22], [-34, 18, -40, 4, -30, 0]], sk, 4.5); line(c, [[-2, 30], [0, 54]], 2.5, dark(sk, .3)); line(c, [[10, 30], [12, 52]], 2.5, dark(sk, .3)) }
  else if (kind === 'point') { shape(c, [[-20, -4], [20, -4], [24, 22, 16, 32, 6, 32], [8, 74], [-6, 74], [-6, 34], [-22, 26, -22, 12, -20, -4]], sk, 4.5) }
  else if (kind === 'fist') { shape(c, [[-22, -4], [22, -4], [28, 22, 18, 38, 0, 38], [-18, 38, -28, 22, -22, -4]], sk, 4.5); for (const t of [-8, 4, 14]) line(c, [[t - 6, 28], [t, 34]], 2.5, dark(sk, .3)) }
  else { shape(c, [[-20, -4], [22, -4], [30, 24, 20, 44, 2, 46], [-16, 46, -26, 30, -22, 12], [-30, 8, -30, 0, -20, -4]], sk, 4.5) }
  c.restore();
}
export function kpChair(x, y, s, flip, col = '#3F444C') {
  const c = ctx(); c.save(); c.translate(x, y); c.scale(s * (flip ? -1 : 1), s); const d = dark(col, .2);
  shape(c, [[-150, 30], [-162, -170, -150, -330, -130, -390], [-90, -398], [-104, -330, -112, -170, -104, 26]], d, 5);
  shape(c, [[-140, 10], [180, 4], [190, 44], [-146, 50]], col, 5);
  for (const [a, b] of [[-120, -132], [160, 172]]) shape(c, [[a, 48], [a + 18, 48], [b + 18, 300], [b, 300]], d, 4);
  c.restore();
}
