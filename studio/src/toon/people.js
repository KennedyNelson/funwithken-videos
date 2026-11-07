// Polished Desi Toon people: 3/4 front view, cel-shaded, smooth outlines. Local units: feet at (0,0), head centre about (0,-640).
import { ctx, OUT, dark, light, mix, cel, blob, poly, ell, fillEll, fillPoly, fillSmooth, smooth, pathOf, line, limb, stroke, lerp, clamp, shadowBlob } from './toon.js';
const LW = 5;
// ---------- face ----------
export function head(o) {
  const c = ctx(), sk = o.skin, f = o.face || {};
  const ry = -640;
  // ears
  for (const q of [-1, 1]) ell(q * 101, ry + 6, 17, 27, sk, () => fillEll(q * 101 + q * 4, ry + 10, 7, 14, dark(sk, .28)), LW);
  if (o.hair === 'bald') for (const q of [-1, 1]) blob([[q * 82, ry - 70], [q * 108, ry - 40], [q * 112, ry + 10], [q * 96, ry + 2], [q * 86, ry - 30]], o.hairCol || '#2a2a2a', null, LW);
  // head shape
  const HP = [[0, ry - 116], [72, ry - 106], [104, ry - 52], [106, ry + 18], [88, ry + 70], [44, ry + 108], [0, ry + 116], [-44, ry + 108], [-88, ry + 70], [-106, ry + 18], [-104, ry - 52], [-72, ry - 106]];
  blob(HP, sk, () => {
    fillEll(78, ry + 30, 60, 120, dark(sk, .18));            // shadow side
    fillEll(0, ry + 128, 90, 26, dark(sk, .22));              // under-chin
    fillEll(-55, ry - 50, 26, 16, light(sk, .18));            // forehead shine
    if (o.stubble) { c.save(); c.globalAlpha = .28; fillEll(0, ry + 84, 82, 44, '#1d1410'); c.restore() }
  }, LW);
  if (f.blush) { c.save(); c.globalAlpha = .28; fillEll(-60, ry + 40, 22, 11, '#E8505B'); fillEll(60, ry + 40, 22, 11, '#E8505B'); c.restore() }
  // eyes
  const look = f.look || [0, 0], eyeR = 27 * (f.eye || 1), ey = ry - 6, lid = clamp(f.lid || 0, 0, 1);
  for (const q of [-1, 1]) {
    const X = q * 41;
    if (f.closed) { line([[X - 22, ey + 2], [X, ey + 12], [X + 22, ey + 2]], 6); continue }
    ell(X, ey, eyeR, eyeR * 1.2, '#FFFFFF', () => { fillEll(X, ey - eyeR * 1.05, eyeR * 1.2, eyeR * .5, '#DDE3EA'); }, 4);
    const pr = eyeR * (f.pupil || .42), px = X + look[0] * eyeR * .42, py = ey + look[1] * eyeR * .45;
    c.save(); c.beginPath(); c.ellipse(X, ey, eyeR, eyeR * 1.2, 0, 0, 7); c.clip();
    fillEll(px, py, pr, pr * 1.1, '#3B2416'); fillEll(px, py, pr * .55, pr * .6, '#120a06');
    fillEll(px - pr * .35, py - pr * .4, pr * .3, pr * .3, '#FFFFFF');
    if (f.tears) { c.globalAlpha = .55; fillEll(X, ey + eyeR * .9, eyeR * 1.1, eyeR * .4, '#9FD8F2'); c.globalAlpha = 1 }
    if (lid > 0) { c.fillStyle = sk; c.fillRect(X - eyeR - 4, ey - eyeR * 1.25, eyeR * 2 + 8, eyeR * 2.4 * lid); c.fillStyle = dark(sk, .15); c.fillRect(X - eyeR - 4, ey - eyeR * 1.25 + eyeR * 2.4 * lid - 6, eyeR * 2 + 8, 6) }
    c.restore();
    c.beginPath(); c.ellipse(X, ey, eyeR, eyeR * 1.2, 0, 0, 7); stroke(4);
    if (lid > 0) line([[X - eyeR, ey - eyeR * 1.2 + eyeR * 2.4 * lid], [X + eyeR, ey - eyeR * 1.2 + eyeR * 2.4 * lid]], 5, OUT, false);
  }
  // brows: f.brow >0 worried (inner up), <0 angry (inner down)
  const b = f.brow || 0, by = ey - eyeR * 1.45 - (f.browUp || 0) * 14;
  for (const q of [-1, 1]) { const X = q * 42, inY = by - b * 14, outY = by + b * 8; poly([[X - q * 30, inY - 4], ['q', X, Math.min(inY, outY) - 14, X + q * 30, outY - 6], [X + q * 30, outY + 6], ['q', X, Math.min(inY, outY) - 2, X - q * 30, inY + 8]], o.browCol || '#1a1210', null, 3) }
  // nose
  line([[6, ry + 18], [18, ry + 44], [2, ry + 50]], 5); fillEll(12, ry + 46, 10, 5, dark(sk, .2));
  // moustache
  if (o.stache) poly([[0, ry + 58], ['q', 30, ry + 50, 58, ry + 74], ['q', 30, ry + 70, 0, ry + 66], ['q', -30, ry + 70, -58, ry + 74], ['q', -30, ry + 50, 0, ry + 58]], o.hairCol || '#1c1410', () => fillEll(-20, ry + 56, 18, 4, '#5a4a40'), 3);
  // mouth
  const my = ry + 80 + (o.stache ? 6 : 0), m = f.mouth || 'smile', op = clamp(f.open == null ? .6 : f.open, 0, 1);
  if (m === 'smile') line([[-30, my - 6], [0, my + 14], [30, my - 6]], 5);
  else if (m === 'bigsmile') poly([[-38, my - 8], ['q', 0, my - 2, 38, my - 8], ['q', 0, my + 40, -38, my - 8]], '#6A1E1E', () => { fillEll(0, my - 4, 34, 9, '#FFFFFF'); fillEll(0, my + 20, 16, 8, '#E86A6A') }, 4);
  else if (m === 'flat') line([[-24, my + 2], [24, my + 2]], 5, OUT, false);
  else if (m === 'sad') line([[-28, my + 10], [0, my - 2], [28, my + 10]], 5);
  else if (m === 'wobble') line([[-30, my + 6], [-15, my], [0, my + 7], [15, my], [30, my + 6]], 5);
  else if (m === 'tight') { line([[-22, my + 4], [22, my + 2]], 5, OUT, false); line([[24, my - 4], [30, my + 6]], 4) }
  else if (m === 'grin') poly([[-40, my - 10], [40, my - 10], ['q', 30, my + 26, 0, my + 28], ['q', -30, my + 26, -40, my - 10]], '#FFFFFF', () => { line([[-40, my + 6], [40, my + 6]], 3, '#9a8a80', false); for (const x of [-24, -8, 8, 24]) line([[x, my - 10], [x, my + 26]], 2, '#b8aaa0', false) }, 4);
  else if (m === 'open' || m === 'shout') { const w = m === 'shout' ? 40 : 26, h = (m === 'shout' ? 40 : 22) * (.35 + .65 * op); ell(0, my + h * .3, w, h, '#5A1414', () => { fillEll(0, my + h * .9, w * .6, h * .45, '#E0605F'); fillEll(0, my - h * .75, w * .8, h * .3, '#FFFFFF') }, 4) }
  // hair
  if (o.hair === 'quiff') {
    poly([[-100, ry - 30], ['q', -110, ry - 120, -40, ry - 140], ['q', 30, ry - 190, 110, ry - 160], ['q', 140, ry - 150, 120, ry - 120], ['q', 118, ry - 80, 106, ry - 40], ['q', 96, ry - 82, 60, ry - 92], ['q', 10, ry - 70, -40, ry - 92], ['q', -84, ry - 80, -100, ry - 30]], o.hairCol || '#151212', () => {
      line([[-30, ry - 135], [40, ry - 165], [95, ry - 150]], 8, '#3a3434'); fillEll(60, ry - 150, 30, 8, '#4a4444', -.2) }, LW);
    for (const q of [-1, 1]) { c.save(); c.globalAlpha = .55; fillEll(q * 96, ry - 20, 10, 34, '#1d1818'); c.restore() }
  } else if (o.hair === 'sidepart') {
    poly([[-104, ry - 10], ['q', -112, ry - 110, -40, ry - 128], ['q', 40, ry - 140, 100, ry - 100], ['q', 112, ry - 70, 104, ry - 16], ['q', 98, ry - 70, 50, ry - 84], ['q', -10, ry - 96, -50, ry - 74], ['q', -88, ry - 60, -104, ry - 10]], o.hairCol || '#17110f', () => { line([[-46, ry - 118], [-30, ry - 80]], 4, '#3c302a', false); fillEll(20, ry - 118, 50, 9, '#3a2e28', -.15) }, LW);
    for (const q of [-1, 1]) fillPoly([[q * 104, ry - 14], [q * 98, ry + 30], [q * 92, ry - 10]], o.hairCol || '#17110f');
  } else if (o.hair === 'bald') {
    c.save(); c.globalAlpha = .8; fillEll(-38, ry - 92, 24, 10, light(sk, .45), -.3); c.restore();
  }
  if (o.specs) { for (const q of [-1, 1]) { c.beginPath(); c.ellipse(q * 41, ey, 36, 32, 0, 0, 7); stroke(5, '#3a2a20') } line([[-6, ey - 4], [6, ey - 4]], 5, '#3a2a20', false) }
  if (o.sweat) for (let i = 0; i < o.sweat; i++) { const x = 104 + i * 8, y = ry - 70 + i * 60; poly([[x, y - 26], ['q', x + 18, y + 4, x, y + 14], ['q', x - 18, y + 4, x, y - 26]], '#9ED8F5', () => fillEll(x - 5, y + 2, 4, 6, '#FFFFFF'), 3) }
}
// ---------- full person ----------
// o: x,y,s,flip,skin,shirt,pant,hair,face,arms[[ex,ey,hx,hy,prop],[...]] (local, relative to shoulder),
//    sit, lungi, vest, belly, gamcha, towel, stache, specs, shoe:'sneaker'|'chappal', tilt, nod, lean, hop
export function person(o) {
  const c = ctx(), s = o.s || 1, sk = o.skin, sh = o.shirt;
  c.save(); c.translate(o.x, o.y - (o.hop || 0)); c.scale(s * (o.flip ? -1 : 1), s);
  if (!o.noShadow) shadowBlob(0, 4, 120, 18, .2);
  const sit = !!o.sit, hipY = sit ? -250 : -290, drop = sit ? 40 : 0;
  // legs
  const pant = o.pant || '#2E4C7A';
  const foot = (x, y, flipX) => {
    if (o.shoe === 'chappal') { poly([[x - 34, y], [x + 40, y], [x + 46, y - 10], [x - 30, y - 10]], '#6B4423', null, 4); ell(x + 6, y - 20, 34, 14, sk, () => fillEll(x + 14, y - 14, 30, 6, dark(sk, .2)), 4) }
    else { poly([[x - 36, y], [x + 50, y], ['q', x + 56, y - 34, x + 20, y - 40], [x - 30, y - 42]], o.shoeCol || '#F2F2F2', () => { fillPoly([[x - 40, y], [x + 56, y], [x + 56, y - 12], [x - 40, y - 12]], '#C9CDD2') }, 4) }
  };
  if (o.lungi) {
    if (!sit) for (const q of [-1, 1]) { limb([[q * 34, -140], [q * 38, -26]], 34, sk, 4, q); foot(q * 40, 0) }
    else for (const q of [-1, 1]) { limb([[q * 38, -150], [q * 46, -24]], 34, sk, 4, q); foot(q * 48, 0) }
    poly(sit ? [[-118, hipY - 30], [118, hipY - 30], [130, -130], [-130, -130]] : [[-96, hipY - 20], [96, hipY - 20], [104, -120], [-104, -120]], o.lungiCol || '#EDEFF2', () => {
      for (let i = -4; i <= 4; i++) line([[i * 26, hipY - 30], [i * 28, -120]], 3, o.lungiLine || '#7FA3C9', false);
      fillPoly([[30, hipY - 30], [130, hipY - 30], [130, -120], [50, -120]], 'rgba(30,20,40,.12)');
    }, LW);
  } else if (sit) {
    for (const q of [-1, 1]) { limb([[q * 44, hipY], [q * 56, hipY + 40], [q * 60, -30]], 58, pant, LW, q); foot(q * 62, 0) }
    fillEll(0, hipY + 6, 100, 40, pant); for (const q of [-1, 1]) { c.beginPath(); c.ellipse(q * 52, hipY + 30, 52, 34, 0, 0, 7); c.fillStyle = pant; c.fill(); stroke(LW) }
  } else {
    for (const q of [-1, 1]) { limb([[q * 44, hipY], [q * 48, -150], [q * 50, -30]], 58, pant, LW, q); foot(q * 52, 0) }
    poly([[-92, hipY - 30], [92, hipY - 30], [94, hipY + 20], [-94, hipY + 20]], pant, () => fillPoly([[30, hipY - 30], [94, hipY - 30], [94, hipY + 20], [40, hipY + 20]], dark(pant, .18)), LW);
  }
  // upper body (lean / nod)
  c.save(); c.translate(0, hipY); c.rotate(o.lean || 0); c.translate(0, -hipY); c.translate(0, drop);
  const shY = -508, wB = o.belly ? 1 : 0;
  const A = o.arms || [[-14, 120, -6, 230], [14, 120, 6, 230]];
  const arm = (a, q) => {
    const sx = q * 96, sy = shY + 18, el = [sx + a[0], sy + a[1]], hd = [sx + a[2], sy + a[3]];
    const sleeveEnd = [lerp(sx, el[0], .55), lerp(sy, el[1], .55)];
    if (o.vest) limb([[sx, sy], el, hd], 40, sk, LW, q);
    else { limb([[sx, sy], el, hd], 40, sk, LW, q); limb([[sx, sy], sleeveEnd], 56, sh, LW, q) }
    ell(hd[0], hd[1], 26, 24, sk, () => fillEll(hd[0] + q * 10, hd[1] + 6, 16, 14, dark(sk, .18)), LW);
    if (a[4]) a[4](hd[0], hd[1]);
  };
  arm(A[0], -1);
  // torso
  const TP = [[-100, shY], [100, shY], ['q', 110, shY + 60, 100 + wB * 18, shY + 120], ['q', 96 + wB * 40, -330, 88 + wB * 20, hipY - 14], [-88 - wB * 20, hipY - 14], ['q', -96 - wB * 40, -330, -100 - wB * 18, shY + 120], ['q', -110, shY + 60, -100, shY]];
  if (o.vest) {
    poly(TP, sk, () => fillEll(70, shY + 140, 50, 200, dark(sk, .18)), LW);
    poly([[-70, shY + 4], [-40, shY + 4], ['q', -20, shY + 70, 0, shY + 74], ['q', 20, shY + 70, 40, shY + 4], [70, shY + 4], ['q', 96 + wB * 20, shY + 120, 92 + wB * 40, -330], [88 + wB * 20, hipY - 14], [-88 - wB * 20, hipY - 14], ['q', -96 - wB * 40, -330, -90, shY + 120]], '#F7F7F2', () => { fillEll(70, shY + 160, 40, 190, '#D9DCE3'); for (const x of [-50, -20, 10, 40]) line([[x, shY + 110], [x + 4, hipY - 20]], 2, '#E2E4EA', false) }, LW);
  } else {
    poly(TP, sh, () => { fillEll(78, shY + 150, 44, 220, dark(sh, .17)); fillEll(-10, shY + 120, 70, 14, dark(sh, .1)); line([[-60, -380], [-30, -340]], 4, dark(sh, .2)); line([[50, -410], [70, -360]], 4, dark(sh, .2)); fillEll(-60, shY + 40, 30, 12, light(sh, .15)) }, LW);
    if (o.collar) { poly([[-46, shY - 2], [0, shY + 40], [-10, shY + 70], [-58, shY + 20]], o.collar, null, 4); poly([[46, shY - 2], [0, shY + 40], [10, shY + 70], [58, shY + 20]], o.collar, null, 4); for (let i = 0; i < 3; i++) fillEll(0, shY + 100 + i * 70, 6, 6, '#E8DFC8') }
    else ell(0, shY + 4, 40, 18, sk, () => fillEll(0, shY + 12, 40, 10, dark(sk, .2)), 4);
    if (o.pocket) poly([[30, shY + 70], [78, shY + 70], [78, shY + 128], [30, shY + 128]], o.shirt, () => fillPoly([[30, shY + 70], [78, shY + 70], [78, shY + 84], [30, shY + 84]], dark(sh, .15)), 4);
  }
  if (o.gamcha) poly([[-96, shY - 6], ['q', -60, shY - 20, -30, shY - 4], [-46, shY + 170], [-92, shY + 160]], o.gamcha, () => { for (let i = 0; i < 3; i++) line([[-88 + i * 18, shY + 6], [-84 + i * 16, shY + 160]], 4, 'rgba(255,255,255,.7)', false); line([[-96, shY + 70], [-40, shY + 76]], 4, 'rgba(255,255,255,.7)', false) }, LW);
  // neck + head
  c.save(); c.translate(0, o.nod ? o.nod * 26 : 0); c.translate(0, shY + 6); c.rotate(o.tilt || 0); c.translate(0, -(shY + 6));
  poly([[-26, shY - 50], [26, shY - 50], [30, shY + 6], [-30, shY + 6]], sk, () => fillPoly([[-30, shY - 50], [30, shY - 50], [30, shY - 26], [-30, shY - 26]], dark(sk, .25)), 4);
  c.translate(0, -24); // head local chin (~-524) meets the neck top (~-548)
  head(o);
  c.restore();
  arm(A[1], 1);
  c.restore();
  c.restore();
}
