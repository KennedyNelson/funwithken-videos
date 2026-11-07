// Polished Desi Toon helpers (see shorts-animation-styles: POLISHED DESI TOON STYLES).
// Smooth vector lines (no wobble), cel shading (base + clipped shadow + highlight), soft blurred painted backgrounds.
export const W = 1080, H = 1920;
export const OUT = '#2B1D16';
let c = null;
export function bind(x) { c = x }
export const ctx = () => c;
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, u) => a + (b - a) * u;
export const ease = u => (u = clamp(u), u * u * (3 - 2 * u));
export const easeOut = u => 1 - Math.pow(1 - clamp(u), 3);
export const back = u => { u = clamp(u); const k = 1.7; return 1 + (k + 1) * Math.pow(u - 1, 3) + k * Math.pow(u - 1, 2) };
export const pr = (t, a, b) => clamp((t - a) / (b - a));
// colour helpers
function hx(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255] }
export function mix(a, b, u) { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], u)).toString(16).padStart(2, '0')).join('') }
export const dark = (col, u = .22) => mix(col, '#1a1020', u);
export const light = (col, u = .3) => mix(col, '#ffffff', u);
// smooth closed path through points (quadratic through midpoints)
export function smooth(pts) {
  const n = pts.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const s = m(pts[n - 1], pts[0]); c.moveTo(s[0], s[1]);
  for (let i = 0; i < n; i++) { const e = m(pts[i], pts[(i + 1) % n]); c.quadraticCurveTo(pts[i][0], pts[i][1], e[0], e[1]) }
  c.closePath();
}
// path from a list where items are [x,y] (corner) or ['q',cx,cy,x,y] / ['c',...]
export function pathOf(def) {
  c.moveTo(def[0][0], def[0][1]);
  for (let i = 1; i < def.length; i++) { const d = def[i]; if (d[0] === 'q') c.quadraticCurveTo(d[1], d[2], d[3], d[4]); else if (d[0] === 'c') c.bezierCurveTo(d[1], d[2], d[3], d[4], d[5], d[6]); else c.lineTo(d[0], d[1]) }
  c.closePath();
}
export function stroke(lw = 5, col = OUT) { if (!lw) return; c.lineJoin = 'round'; c.lineCap = 'round'; c.lineWidth = lw; c.strokeStyle = col; c.stroke() }
// cel-shaded shape. mk(): builds the path. shadeFn(): draws shadow/highlight shapes (clipped). Outline last.
export function cel(mk, fill, shadeFn, lw = 5) {
  c.beginPath(); mk(); c.fillStyle = fill; c.fill();
  if (shadeFn) { c.save(); c.beginPath(); mk(); c.clip(); shadeFn(); c.restore() }
  c.beginPath(); mk(); stroke(lw);
}
export const blob = (pts, fill, shadeFn, lw = 5) => cel(() => smooth(pts), fill, shadeFn, lw);
export const poly = (def, fill, shadeFn, lw = 5) => cel(() => pathOf(def), fill, shadeFn, lw);
export function ell(x, y, rx, ry, fill, shadeFn, lw = 5, rot = 0) { cel(() => c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, Math.PI * 2), fill, shadeFn, lw) }
export function fillEll(x, y, rx, ry, fill, rot = 0) { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, 7); c.fillStyle = fill; c.fill() }
export function fillPoly(def, fill) { c.beginPath(); pathOf(def); c.fillStyle = fill; c.fill() }
export function fillSmooth(pts, fill) { c.beginPath(); smooth(pts); c.fillStyle = fill; c.fill() }
export function rrect(x, y, w, h, r, fill, shadeFn, lw = 5) { cel(() => c.roundRect(x, y, w, h, r), fill, shadeFn, lw) }
export function line(pts, lw = 5, col = OUT, curve = true) {
  c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  if (curve && pts.length > 2) { for (let i = 1; i < pts.length - 1; i++) { const e = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]; c.quadraticCurveTo(pts[i][0], pts[i][1], e[0], e[1]) } const l = pts[pts.length - 1]; c.lineTo(l[0], l[1]) }
  else for (let i = 1; i < pts.length; i++)c.lineTo(pts[i][0], pts[i][1]);
  stroke(lw, col);
}
// thick limb with outline, base colour and a shadow strip along one side
export function limb(pts, w, col, lw = 5, shadeSide = 1) {
  const draw = (wid, colr) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++)c.lineTo(pts[i][0], pts[i][1]); c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = wid; c.strokeStyle = colr; c.stroke() };
  draw(w + lw * 2, OUT); draw(w, col);
  c.save(); c.translate(shadeSide * w * .26, 0); draw(w * .32, dark(col, .18)); c.restore();
  c.save(); c.translate(-shadeSide * w * .24, 0); draw(w * .16, light(col, .14)); c.restore();
}
export function shadowBlob(x, y, rx, ry, a = .22) { c.save(); c.globalAlpha = a; fillEll(x, y, rx, ry, '#1a1020'); c.restore() }
// text label: white rectangle, black text, one keyword red
export function label(parts, x, y, size = 58, font = 'Inter') {
  c.save(); c.font = `800 ${size}px ${font}`; c.textBaseline = 'middle';
  const ws = parts.map(p => c.measureText(p[0]).width), tw = ws.reduce((a, b) => a + b, 0);
  const padX = 34, h = size * 1.55; c.fillStyle = '#FFFFFF'; c.shadowColor = 'rgba(0,0,0,.25)'; c.shadowBlur = 18; c.shadowOffsetY = 6;
  c.fillRect(x - tw / 2 - padX, y - h / 2, tw + padX * 2, h); c.shadowColor = 'transparent';
  let X = x - tw / 2; parts.forEach((p, i) => { c.fillStyle = p[1] || '#111'; c.fillText(p[0], X, y + 2); X += ws[i] }); c.restore();
}
// cached offscreen layer (draw once, reuse every frame)
const cache = {};
export function layer(key, w, h, fn) {
  if (!cache[key]) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const prev = c; c = cv.getContext('2d'); fn(); c = prev; cache[key] = cv }
  return cache[key];
}
// blurred copy of a cached layer
export function blurred(key, src, px) {
  if (!cache[key]) { const cv = document.createElement('canvas'); cv.width = src.width; cv.height = src.height; const g = cv.getContext('2d'); g.filter = `blur(${px}px)`; g.drawImage(src, 0, 0); cache[key] = cv }
  return cache[key];
}
export const fx = { grainC: null };
export function finish(t) {
  if (!fx.grainC) { const g = document.createElement('canvas'); g.width = g.height = 256; const q = g.getContext('2d'), d = q.createImageData(256, 256); for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255 } q.putImageData(d, 0, 0); fx.grainC = g }
  c.save(); c.globalCompositeOperation = 'overlay'; c.globalAlpha = .05; const o = (Math.floor(t * 24) * 61) % 256; for (let x = -o; x < W; x += 256)for (let y = -o; y < H; y += 256)c.drawImage(fx.grainC, x, y); c.restore();
  const v = c.createRadialGradient(W / 2, H / 2, H * .42, W / 2, H / 2, H * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(40,20,10,.22)'); c.fillStyle = v; c.fillRect(0, 0, W, H);
}
// word captions (white, black outline, yellow keyword), popped on start
export function captions(groups, t, keys, y = 1690) {
  let g = null; for (const k of groups) if (t >= k.s - .04 && t < k.e) g = k; if (!g) return;
  const u = clamp((t - g.s) / .11), z = lerp(.75, 1, back(u)); c.save(); c.translate(W / 2, y); c.scale(z, z); c.font = '900 84px Inter'; c.textBaseline = 'middle';
  const parts = g.txt.split(' '), sp = 24, ws = parts.map(p => c.measureText(p).width); const tw = ws.reduce((a, b) => a + b, 0) + sp * (parts.length - 1); const fit = tw > 960 ? 960 / tw : 1; c.scale(fit, fit); let x = -tw / 2;
  c.textAlign = 'left'; parts.forEach((p, i) => { c.lineJoin = 'round'; c.strokeStyle = '#000'; c.lineWidth = 18; c.strokeText(p, x, 0); c.fillStyle = keys.test(p) ? '#FFD93B' : '#FFFFFF'; c.fillText(p, x, 0); x += ws[i] + sp }); c.restore();
}
export function groupWords(ws) {
  const o = []; let cur = []; const flush = () => { if (cur.length) { o.push({ txt: cur.map(w => w.w).join(' '), s: cur[0].s, e: cur[cur.length - 1].e }); cur = [] } };
  ws.forEach(w => { if (cur.length && cur[0].line !== w.line) flush(); cur.push(w); const j = cur.map(x => x.w).join(' '); if (/[.,!?…—]$/.test(w.w) || cur.length >= 3 || j.length > 13) flush() }); flush();
  for (let i = 0; i < o.length; i++)o[i].e = i < o.length - 1 ? Math.min(o[i + 1].s, o[i].e + .35) : o[i].e + .5; return o;
}
