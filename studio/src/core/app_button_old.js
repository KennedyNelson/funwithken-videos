// The "app" shown on the big monitor: a 2D canvas drawn each frame and used as a texture (so the 3D camera can fly at it).
import { TAU, clamp, lerp, seg, eio, eob } from './lib.js';
let c = null;
const rr = (x, y, w, h, r, f) => { c.beginPath(); c.roundRect(x, y, w, h, r); c.fillStyle = f; c.fill(); };
const circ = (x, y, r, f) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = f; c.fill(); };
const elp = (x, y, rx, ry, f) => { c.beginPath(); c.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), 0, 0, TAU); c.fillStyle = f; c.fill(); };
function star4(x, y, r, rot, f) { c.save(); c.translate(x, y); c.rotate(rot); c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rad = i % 2 ? r * 0.3 : r; c.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); } c.closePath(); c.fillStyle = f; c.fill(); c.restore(); }
function pill(txt, x, y, bg, fg, size, a) { if (a <= 0.01) return; c.save(); c.translate(x, y); c.scale(a, a); c.font = `900 ${size}px Inter`; const w = c.measureText(txt).width + size * 1.1; rr(-w / 2, -size * .75, w, size * 1.5, size * .75, bg); c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 0, size * 0.05); c.restore(); }
function doc(x, y, s, a, rot) { c.save(); c.globalAlpha = a; c.translate(x, y); c.rotate(rot); c.scale(s, s); rr(-16, -21, 32, 42, 5, '#fff'); c.beginPath(); c.moveTo(6, -21); c.lineTo(16, -11); c.lineTo(6, -11); c.closePath(); c.fillStyle = '#C9D3FF'; c.fill(); c.fillStyle = '#9AA8E6'; c.fillRect(-9, -2, 18, 4); c.fillRect(-9, 7, 12, 4); c.restore(); }
function cyl(x, y, s, a) { c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s); rr(-36, -30, 72, 64, 8, '#35B8D4'); elp(0, 34, 36, 12, '#2A9DB8'); elp(0, -30, 36, 13, '#7FE3F5'); c.strokeStyle = '#2A9DB8'; c.lineWidth = 4; c.beginPath(); c.ellipse(0, -4, 36, 12, 0, 0.1, Math.PI - 0.1); c.stroke(); c.beginPath(); c.ellipse(0, 14, 36, 12, 0, 0.1, Math.PI - 0.1); c.stroke(); c.restore(); }
function cursor(x, y, a) { c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(1.3, 1.3); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 46); c.lineTo(12, 35); c.lineTo(22, 56); c.lineTo(31, 52); c.lineTo(21, 31); c.lineTo(36, 30); c.closePath(); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 6; c.lineJoin = 'round'; c.strokeStyle = '#1A1A1E'; c.stroke(); c.restore(); }

/** draws the app at time t onto canvas 2D context `cx` (1024x760). `T` holds the event times. returns { bloat } for 3D pulses */
export function drawApp(cx, t, T) {
  c = cx; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 1024, 760); c.fillStyle = '#0D0A1E'; c.fillRect(0, 0, 1024, 760);
  const gone = (k) => eio(seg(t, T.U + k, T.U + k + .35));
  const bloat = eio(seg(t, T.GB, T.GB + .5)) * (1 - eio(seg(t, T.U + .5, T.U + 1.4)));
  const dark = eio(seg(t, T.DARK, T.DARK + .4)) * (1 - eio(seg(t, T.U + .1, T.U + .5)));
  const sc = 1.4 * (1 + 0.1 * bloat);
  c.save(); c.translate(512, 395); c.scale(sc, sc);
  rr(-290, -190, 580, 400, 34, '#0F1430'); rr(-282, -182, 564, 384, 28, dark > .5 ? '#1B2036' : '#F4F6FB');
  c.fillStyle = dark > .5 ? '#2B3252' : '#DDE2F0'; c.beginPath(); c.roundRect(-282, -182, 564, 56, [28, 28, 0, 0]); c.fill();
  circ(-246, -154, 9, '#FF6B6B'); circ(-218, -154, 9, '#FFD43B'); circ(-190, -154, 9, '#46D18A');
  const bar = dark > .5 ? '#3A4470' : '#D3D9EC'; rr(-210, -104, 330, 20, 10, bar); rr(-210, -72, 220, 20, 10, bar);
  const bl = t >= T.BLUE ? 1 : 0, bp = bl ? eob(seg(t, T.BLUE, T.BLUE + .45)) : 1, bs = bl ? lerp(.8, 1, bp) : 1, mark = eio(seg(t, T.KEEP, T.KEEP + .4));
  c.save(); c.translate(0, 94); c.scale(bs * (1 + .05 * mark), bs * (1 + .05 * mark)); rr(-130, -42, 260, 84, 24, bl ? '#3E7BFA' : '#9AA3B8'); rr(-130, 14, 260, 28, [0, 0, 24, 24], bl ? '#2F63D6' : '#808AA3');
  c.font = '900 40px Inter'; c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.letterSpacing = '3px'; c.fillText('SUBMIT', 0, -4); c.letterSpacing = '0px'; c.restore();
  if (t > T.BLUE && t < T.BLUE + .9) { const a = (t - T.BLUE) / .9; for (let i = 0; i < 6; i++) { const an = i / 6 * TAU + .3, r = 120 + a * 70; c.globalAlpha = 1 - a; star4(Math.cos(an) * r * 1.4, 94 + Math.sin(an) * r * .55, 13, a * 3, '#FFD43B'); } c.globalAlpha = 1; }
  if (t > T.REF && t < T.U + .5) for (let i = 0; i < 12; i++) { const st = T.REF + i * .1, u = seg(t, st, st + .7); if (u > 0 && u < 1) { const sx = (i % 2 ? 1 : -1) * (420 + (i % 3) * 40), sy = -200 + (i % 4) * 110; doc(lerp(sx, 0, eio(u)), lerp(sy, 20, eio(u)), 1 - u * .5, 1 - u * u, (1 - u) * (i % 2 ? .6 : -.6)); } }
  pill('47 FILES', -170, -222, '#FFD43B', '#1A1A1E', 30, eob(seg(t, T.REF + .6, T.REF + .9)) * (1 - gone(0)));
  if (dark > .01) { c.globalAlpha = dark; circ(222, -104, 30, '#FFF1B8'); circ(236, -112, 26, '#1B2036'); star4(180, -60, 9, t, '#FFF1B8'); c.globalAlpha = 1; }
  pill('DARK MODE', 130, -222, '#6C5CE7', '#fff', 28, eob(seg(t, T.DARK + .1, T.DARK + .4)) * (1 - gone(.1)));
  if (t > T.DB && t < T.U + .5) { const u = seg(t, T.DB, T.DB + 1.0), a = 1 - gone(.2); c.globalAlpha = a; for (let i = 0; i < 5; i++) circ(-170 + i * 84, 12, 7, 'rgba(79,209,232,.7)'); c.globalAlpha = 1; cyl(lerp(-190, 190, eio(u)), 6, .8, a * eob(seg(t, T.DB, T.DB + .3))); pill('DB MIGRATED', -60, 215, '#35B8D4', '#1A1A1E', 26, eob(seg(t, T.DB + .9, T.DB + 1.2)) * a); }
  const ga = eob(seg(t, T.GB, T.GB + .3)) * (1 - gone(.5)); if (ga > .01) { c.save(); c.translate(235, 195); c.scale(ga, ga); c.rotate(.1); rr(-110, -48, 220, 96, 28, '#F0475B'); c.font = '900 66px Inter'; c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('3 GB', 0, 4); c.restore(); }
  c.restore();
  if (t > T.FEAT && t < T.U + .3) for (let i = 0; i < 9; i++) { const a = seg(t, T.FEAT + i * .08, T.FEAT + i * .08 + .3), an = i * 2.1, r = 300 + (i % 3) * 36; if (a > 0) { c.globalAlpha = a * (1 - gone(0)); star4(512 + Math.cos(an) * r * 1.5, 390 + Math.sin(an) * r * .95, 14 + (i % 3) * 5, t * 2 + i, '#FFD43B'); } } c.globalAlpha = 1;
  if (t > T.U && t < T.U + 1.5) { const a = eob(seg(t, T.U, T.U + .25)) * (1 - seg(t, T.U + 1.1, T.U + 1.5)); c.save(); c.translate(512, 390); c.scale(a, a); c.rotate(-(t - T.U) * 7); c.beginPath(); c.arc(0, 0, 90, .5, TAU - .5); c.strokeStyle = '#fff'; c.lineWidth = 28; c.lineCap = 'round'; c.stroke(); c.beginPath(); c.moveTo(78, -66); c.lineTo(112, -64); c.lineTo(100, -26); c.closePath(); c.fillStyle = '#fff'; c.fill(); c.restore(); pill('UNDO', 512, 120, '#F0475B', '#fff', 46, a); }
  if (t > T.CUR) { const u = eio(seg(t, T.CUR, T.CUR + 0.9)), away = eio(seg(t, T.KEEP, T.KEEP + .5)), wob = Math.sin(t * 9) * 5 * (1 - away) * u; cursor(lerp(900, 600, u) + wob + away * 380, lerp(220, 520, u) - away * 220, 1 - away);
    if (u > .6) { const q = eob(seg(t, T.CUR + .6, T.CUR + .9)) * (1 - away); c.save(); c.globalAlpha = q; c.font = '900 110px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 20; c.lineJoin = 'round'; c.strokeStyle = '#1A1A1E'; c.strokeText('?', 790, 440); c.fillStyle = '#FFD43B'; c.fillText('?', 790, 440); c.restore(); } }
  if (mark > .01) { c.save(); c.translate(745, 470); c.scale(eob(mark), eob(mark)); circ(0, 0, 50, '#46D18A'); c.strokeStyle = '#fff'; c.lineWidth = 13; c.lineCap = 'round'; c.beginPath(); c.moveTo(-20, 4); c.lineTo(-5, 20); c.lineTo(22, -15); c.stroke(); c.restore(); }
  return { bloat };
}
