// The big monitor: a git terminal drawn on a 2D canvas (1024x760) and used as a texture.
import { TAU, clamp, lerp, seg, eio, eob } from './lib.js';
let c = null;
const rr = (x, y, w, h, r, f) => { c.beginPath(); c.roundRect(x, y, w, h, r); c.fillStyle = f; c.fill(); };
const MONO = '700 38px "DejaVu Sans Mono", Menlo, monospace';
const typed = (s, t, t0, cps = 26) => s.slice(0, clamp(Math.floor((t - t0) * cps), 0, s.length));
function line(txt, x, y, col) { c.fillStyle = col; c.fillText(txt, x, y); }
export function drawApp(cx, t, T) {
  c = cx; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 1024, 760); c.fillStyle = '#120D26'; c.fillRect(0, 0, 1024, 760);
  rr(24, 24, 976, 712, 30, '#1A1336'); c.fillStyle = '#2A2050'; c.beginPath(); c.roundRect(24, 24, 976, 74, [30, 30, 0, 0]); c.fill();
  for (const [i, col] of ['#FF6B6B', '#FFD43B', '#46D18A'].entries()) { c.beginPath(); c.arc(70 + i * 40, 61, 12, 0, TAU); c.fillStyle = col; c.fill(); }
  c.font = '700 30px "DejaVu Sans Mono", monospace'; c.fillStyle = '#9C90D0'; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillText('my-app  ~  zsh', 220, 72);
  c.font = MONO;
  const wiped = t >= T.WIPE, restored = t >= T.RESTORE;
  if (t < T.CHAT) {
    // commit counter badge
    const n = restored ? 47 : wiped ? 0 : 47, col = restored ? '#46D18A' : wiped ? '#FF5D6C' : '#7CE3FF';
    const pop = restored ? eob(seg(t, T.RESTORE + .6, T.RESTORE + .95)) : wiped ? eob(seg(t, T.WIPE, T.WIPE + .3)) : 1, shake = wiped && !restored ? Math.sin(t * 60) * 5 * (1 - seg(t, T.WIPE, T.WIPE + .8)) : 0;
    c.save(); c.translate(512 + shake, 168); c.scale(0.9 + 0.1 * pop, 0.9 + 0.1 * pop); rr(-230, -44, 460, 88, 26, col + '33'); c.strokeStyle = col; c.lineWidth = 5; c.beginPath(); c.roundRect(-230, -44, 460, 88, 26); c.stroke();
    c.font = '900 52px Inter'; c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(`COMMITS  ${n}`, 0, 4); c.restore(); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.font = MONO;
  }
  if (t < T.BR) {
    line('$ ' + typed('git push --force', t, T.FP), 60, 300, '#E8E2FF');
    if (wiped) { const a = eob(seg(t, T.WIPE, T.WIPE + .2)); c.globalAlpha = a; line('+ main -> main', 60, 360, '#FF8A96'); line('  (forced update)', 60, 410, '#FF8A96'); c.globalAlpha = 1; }
    else if (t > T.FP && Math.floor(t * 2) % 2 === 0 && t > T.FP + .5) { c.fillStyle = '#E8E2FF'; c.fillRect(60 + c.measureText('$ git push --force').width + 6, 268, 20, 38); }
    if (wiped && t > T.WIPE + .6) { const a = eob(seg(t, T.WIPE + .6, T.WIPE + .9)); c.save(); c.globalAlpha = a; c.translate(512, 560); c.rotate(-0.05); rr(-330, -62, 660, 124, 30, '#FF5D6C'); c.font = '900 64px Inter'; c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('WEEK OF CODE: GONE', 0, 4); c.restore(); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.font = MONO; }
  } else {
    line('$ ' + typed('git branch -a', t, T.BR), 60, 300, '#E8E2FF');
    const o = (i, s) => eob(seg(t, T.BR + .7 + i * .15, T.BR + .95 + i * .15));
    c.globalAlpha = o(0); line('  main', 60, 360, '#9C90D0'); c.globalAlpha = o(1); line('  remotes/origin/main', 60, 410, '#9C90D0'); c.globalAlpha = 1;
    const j = eob(seg(t, T.JIC, T.JIC + .35));
    if (j > .01) { c.save(); c.globalAlpha = Math.min(1, j); c.translate(0, 0); rr(44, 428, 820, 70, 16, '#46D18A33'); c.strokeStyle = '#46D18A'; c.lineWidth = 4; c.beginPath(); c.roundRect(44, 428, 820, 70, 16); c.stroke(); c.font = '900 40px "DejaVu Sans Mono", monospace'; c.fillStyle = '#7CFFB8'; c.fillText('* just-in-case', 60, 478); c.restore(); c.font = MONO; }
    if (t >= T.RESTORE - .4) { const k = seg(t, T.RESTORE - .4, T.RESTORE + .6); line('$ ' + typed('git checkout just-in-case', t, T.RESTORE - .4, 34), 60, 560, '#E8E2FF'); if (restored) { c.globalAlpha = eob(seg(t, T.RESTORE + .3, T.RESTORE + .6)); line('47 commits restored', 60, 620, '#7CFFB8'); c.globalAlpha = 1; } }
    if (restored) { const m = eob(seg(t, T.RESTORE + .7, T.RESTORE + 1.05)); c.save(); c.translate(900, 600); c.scale(m, m); c.beginPath(); c.arc(0, 0, 54, 0, TAU); c.fillStyle = '#46D18A'; c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 14; c.lineCap = 'round'; c.beginPath(); c.moveTo(-22, 4); c.lineTo(-6, 22); c.lineTo(24, -16); c.stroke(); c.restore(); }
  }
  if (t >= T.CHAT) {
    const a = eob(seg(t, T.CHAT, T.CHAT + .25)); c.save(); c.globalAlpha = a;
    c.fillStyle = '#1A1336'; c.fillRect(24, 100, 976, 630); c.font = '900 34px Inter'; c.fillStyle = '#9C90D0'; c.fillText('just-in-case / chat.log', 60, 160);
    c.font = '700 34px "DejaVu Sans Mono", monospace'; c.fillStyle = '#E8E2FF'; c.fillText('you: Claude, I just lost', 60, 270); c.fillText('     a week of code.', 60, 320);
    const b = eob(seg(t, T.CHAT + .5, T.CHAT + .8)); c.globalAlpha = a * b; rr(44, 372, 920, 130, 20, '#FF5D6C33'); c.strokeStyle = '#FF5D6C'; c.lineWidth = 4; c.beginPath(); c.roundRect(44, 372, 920, 130, 20); c.stroke();
    c.font = '900 56px "DejaVu Sans Mono", monospace'; c.fillStyle = '#FF8A96'; c.fillText('you: You are sh*t.', 70, 460);
    c.globalAlpha = a * eob(seg(t, T.CHAT + 1.0, T.CHAT + 1.3)); rr(520, 570, 440, 100, 50, '#46D18A'); c.font = '900 48px Inter'; c.fillStyle = '#0B2A1A'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SAVED  ✓', 740, 624); c.restore();
  }
  return { bloat: 0 };
}
