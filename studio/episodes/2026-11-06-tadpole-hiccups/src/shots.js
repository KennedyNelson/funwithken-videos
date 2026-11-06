// A TADPOLE IS CAUSING YOUR HICCUPS: Inside Out style, Grandpa Tadpole. No SFX (owner's rule): cues stay empty.
import { ctx, C, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line, fillAll } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
import { ENV } from './env.js';

const G = { body: '#7FB347', dark: '#5F8F2F', belly: '#BFDC8A', tail: '#8FC25A', brow: '#FFFFFF', water: '#7FD8EC', wood: '#C8946A', woodD: '#A87650', grass: '#8ED07A', sky: '#CFEFFA', sun: '#FFD43B', wall: '#FFF3D6' };
const talk = (t) => ENV.G[Math.floor(t * 50)] || 0;

// ───────────── Grandpa Tadpole: side-on body, wavy tail, bushy white brows, walrus moustache, round specs ─────────────
function tad(o) {
  const { x, y, s = 1, t = 0, m = 0, rot = 0, flip = 0, eyes = 'n', tilt = 0, specs = true, face = true, mood = '' } = o;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale((flip ? -1 : 1) * s, s);
  // tail
  ctx.beginPath(); ctx.moveTo(-110, -46);
  for (let i = 1; i <= 12; i++) { const u = i / 12; ctx.lineTo(-110 - u * 300, -46 + u * 40 + Math.sin(u * 6 - t * 11) * 30 * u); }
  for (let i = 12; i >= 0; i--) { const u = i / 12; ctx.lineTo(-110 - u * 300, 56 - u * 58 + Math.sin(u * 6 - t * 11) * 30 * u); }
  ctx.closePath(); ctx.fillStyle = G.tail; ctx.fill();
  // body
  ell(0, 0, 165, 135, G.body); ell(14, 52, 118, 70, G.belly);
  if (face) {
    ctx.save(); ctx.rotate(tilt);
    for (const ex of [-6, 94]) {
      if (eyes === 'closed') { ctx.beginPath(); ctx.arc(ex, -38, 26, 0.1 * Math.PI, 0.9 * Math.PI); ctx.strokeStyle = C.ink; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.stroke(); }
      else { const r = eyes === 'wide' ? 40 : 32; circle(ex, -42, r, C.white); circle(ex + 6, -40, eyes === 'wide' ? 11 : 15, C.ink); circle(ex + 11, -46, 5, C.white); }
    }
    if (specs) { ctx.strokeStyle = C.ink; ctx.lineWidth = 7; for (const ex of [-6, 94]) { ctx.beginPath(); ctx.arc(ex, -42, 42, 0, TAU); ctx.stroke(); } line([[36, -46], [52, -46]], C.ink, 7); }
    // bushy brows
    const up = eyes === 'wide' ? -24 : 0, fr = mood === 'puzzled' ? 1 : 0;
    ell(-8, -96 + up - fr * 18, 56, 22, G.brow, -0.22 - fr * 0.3); ell(96, -96 + up + fr * 8, 56, 22, G.brow, 0.22 + fr * 0.2);
    for (const ex of [-40, -10, 22, 64, 96, 128]) ell(ex, -106 + up - (ex < 40 ? fr * 18 : -fr * 8), 16, 12, G.brow);
    // mouth + moustache
    const mo = clamp(m);
    ell(52, 44 + mo * 16, 48 - mo * 4, 8 + mo * 42, C.mouth);
    if (mo > 0.2) ell(52, 64 + mo * 22, 26, 12 * mo, C.pink);
    ctx.beginPath(); ctx.moveTo(52, 16); ctx.bezierCurveTo(10, 4, -32, 22, -44, 52); ctx.bezierCurveTo(-8, 44, 30, 46, 52, 30); ctx.bezierCurveTo(74, 46, 112, 44, 148, 52); ctx.bezierCurveTo(136, 22, 94, 4, 52, 16); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill();
    ctx.restore();
  }
  if (o.extra) o.extra();
  ctx.restore();
}
/** a plain baby tadpole, no face details */
function tiny(x, y, s, t, flip) {
  ctx.save(); ctx.translate(x, y); ctx.scale((flip ? -1 : 1) * s, s);
  ctx.beginPath(); ctx.moveTo(-60, -22); for (let i = 1; i <= 8; i++) { const u = i / 8; ctx.lineTo(-60 - u * 150, -22 + u * 22 + Math.sin(u * 6 - t * 13) * 18 * u); } for (let i = 8; i >= 0; i--) { const u = i / 8; ctx.lineTo(-60 - u * 150, 22 - u * 22 + Math.sin(u * 6 - t * 13) * 18 * u); } ctx.closePath(); ctx.fillStyle = G.tail; ctx.fill();
  ell(0, 0, 80, 62, G.body); circle(38, -22, 15, C.white); circle(42, -21, 8, C.ink);
  ctx.restore();
}
function lever(x, y, a, s = 1) { // a 0 = up, 1 = pulled
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-60, 0, 120, 44, 12); ctx.fillStyle = C.ink; ctx.fill();
  ctx.save(); ctx.rotate(lerp(0.6, -0.75, a)); rr(-11, -190, 22, 190, 10); ctx.fillStyle = '#8A8F9C'; ctx.fill(); circle(0, -196, 36, C.red); circle(-10, -206, 10, '#F0727E'); ctx.restore();
  ctx.restore();
}
// ───────────── THROAT: bright pink tunnel with the gate (two fleshy doors) ─────────────
function throat(t, gate, opts = {}) {
  fillAll(C.pinkDark);
  ctx.beginPath();
  for (let y = -300; y <= H + 300; y += 40) ctx.lineTo(70 + Math.sin(y * 0.01 + t * 1.5) * 26, y);
  for (let y = H + 300; y >= -300; y -= 40) ctx.lineTo(1010 + Math.sin(y * 0.012 - t * 1.5) * 26, y);
  ctx.closePath(); ctx.fillStyle = C.pinkLight; ctx.fill();
  ctx.strokeStyle = C.pink; ctx.lineWidth = 16; ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) { const y = 120 + i * 300; ctx.beginPath(); ctx.moveTo(110, y); ctx.quadraticCurveTo(540, y + 60 + Math.sin(t + i) * 14, 970, y); ctx.stroke(); }
  // ledge
  ctx.fillStyle = C.pinkDark; ctx.beginPath(); ctx.ellipse(540, 1240, 520, 120, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = C.pink; ctx.beginPath(); ctx.ellipse(540, 1215, 500, 105, 0, 0, TAU); ctx.fill();
  // gate
  const g = eob(clamp(gate)), gy = opts.gy ?? 430;
  for (const sd of [-1, 1]) {
    const ex = 540 + sd * lerp(470, 6, g);
    ctx.beginPath(); ctx.moveTo(540 + sd * 620, gy - 88); ctx.quadraticCurveTo(ex + sd * 40, gy - 84, ex, gy); ctx.quadraticCurveTo(ex + sd * 40, gy + 84, 540 + sd * 620, gy + 88); ctx.closePath();
    ctx.fillStyle = C.red; ctx.fill();
    ctx.beginPath(); ctx.moveTo(540 + sd * 620, gy - 50); ctx.quadraticCurveTo(ex + sd * 70, gy - 42, ex + sd * 34, gy); ctx.quadraticCurveTo(ex + sd * 70, gy + 10, 540 + sd * 620, gy + 18); ctx.closePath();
    ctx.fillStyle = '#EE5A67'; ctx.fill();
  }
}
function drop(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, -70); ctx.bezierCurveTo(50, -10, 50, 50, 0, 50); ctx.bezierCurveTo(-50, 50, -50, -10, 0, -70); ctx.fillStyle = G.water; ctx.fill(); ell(-14, 16, 9, 16, C.white, 0.3); ctx.restore(); }
// ───────────── MEETING ROOM ─────────────
function office() {
  fillAll(G.wall);
  for (const x of [90, 420, 750]) { rr(x, 170, 260, 430, 16); ctx.fillStyle = C.white; ctx.fill(); rr(x + 16, 186, 228, 398, 8); ctx.fillStyle = G.sky; ctx.fill(); ell(x + 110, 300, 62, 24, C.white); ell(x + 150, 288, 40, 26, C.white); rr(x + 16, 500, 228, 84, 8); ctx.fillStyle = G.grass; ctx.fill(); }
  ctx.fillStyle = '#F4C95D'; ctx.fillRect(-300, 640, W + 600, 24);
}
function table() {
  rr(-200, 1060, W + 400, 120, 20); ctx.fillStyle = G.wood; ctx.fill();
  ctx.fillStyle = G.woodD; ctx.fillRect(-200, 1150, W + 400, 900);
  ctx.fillStyle = '#B98660'; ctx.fillRect(-200, 1180, W + 400, 60);
}
function npc(x, y, s, o) { // a colleague behind the table, seen chest up
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-130, 40, 260, 340, 70); ctx.fillStyle = o.shirt; ctx.fill();
  if (o.tie) { ctx.beginPath(); ctx.moveTo(-20, 44); ctx.lineTo(20, 44); ctx.lineTo(30, 240); ctx.lineTo(0, 280); ctx.lineTo(-30, 240); ctx.closePath(); ctx.fillStyle = o.tie; ctx.fill(); }
  rr(-30, 10, 60, 50, 16); ctx.fillStyle = o.skin; ctx.fill();
  ell(0, -60, 98, 106, o.skin);
  o.hair && o.hair();
  const look = o.look || 0, wide = o.wide;
  for (const sd of [-1, 1]) { if (wide) circle(sd * 36, -66, 20, C.white); ell(sd * 36 + look * 12, -66, wide ? 10 : 11, wide ? 10 : 14, C.ink); }
  ctx.lineCap = 'round'; ctx.strokeStyle = C.ink; ctx.lineWidth = 9; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 18, -98 - (wide ? 16 : 0)); ctx.lineTo(sd * 58, -104 - (wide ? 16 : 0)); ctx.stroke(); }
  if (o.mouth === 'o') ell(0, -8, 14, 18, C.mouth); else line([[-20, -4], [20, -4]], C.mouth, 8);
  ctx.restore();
}
const boss = (x, y, s, look, wide) => npc(x, y, s, { shirt: '#3D5A80', tie: C.red, skin: '#F0C8A0', look, wide, mouth: wide ? 'o' : '', hair: () => { ell(-92, -80, 22, 40, '#7A7A84'); ell(92, -80, 22, 40, '#7A7A84'); } });
const coll = (x, y, s, look, wide) => npc(x, y, s, { shirt: '#6AB187', skin: '#8D5A3C', look, wide, mouth: wide ? 'o' : '', hair: () => { for (let i = 0; i < 9; i++) circle(-100 + i * 25, -146 - Math.sin(i / 8 * Math.PI) * 26, 44, '#2A1D18'); } });
function laptop(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(-120, -150, 240, 150, 12); ctx.fillStyle = '#9AA3B2'; ctx.fill(); circle(0, -76, 16, '#C5CCD8'); rr(-140, 0, 280, 18, 8); ctx.fillStyle = '#7C8596'; ctx.fill(); ctx.restore(); }
function meeting(lt, o = {}) {
  office();
  boss(190, 760, 0.92, o.look ? 1 : 0, o.wide);
  coll(890, 780, 0.92, o.look ? -1 : 0, o.wide);
  K.man({ x: 540, y: 960 - (o.jump || 0), s: 0.95, arm: o.arm, armL: o.armL, eyes: o.eyes, mouth: o.mouth, brow: o.brow, look: o.heroLook, holding: o.holding });
  o.afterHero && o.afterHero();
  table(); laptop(200, 1070, 0.8); laptop(880, 1070, 0.8);
}
// ───────────── OTHER PIECES ─────────────
function pond(t) {
  fillAll('#A6E6F2');
  ctx.fillStyle = '#C8F2F8'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(100 + i * 220, -300); ctx.lineTo(230 + i * 220, -300); ctx.lineTo(60 + i * 220, 1500); ctx.lineTo(-60 + i * 220, 1500); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = '#E8D9A8'; ctx.fillRect(-300, 1540, W + 600, 700);
  for (let i = 0; i < 7; i++) { const x = 70 + i * 160; ctx.beginPath(); ctx.moveTo(x, 1560); for (let y = 1560; y > 1160 - rnd(i) * 200; y -= 30) ctx.lineTo(x + Math.sin(y * 0.02 + t * 2 + i) * 22, y); ctx.strokeStyle = C.leaf; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.stroke(); }
  for (let i = 0; i < 9; i++) { const ph = (t * 0.25 + rnd(i)) % 1; ctx.beginPath(); ctx.arc(rnd(i + 4) * W, 1300 - ph * 1400, 10 + rnd(i + 2) * 12, 0, TAU); ctx.strokeStyle = C.white; ctx.lineWidth = 5; ctx.stroke(); }
}
function field(t, spin) {
  const d = 0.5 + 0.5 * Math.cos(spin);
  ctx.fillStyle = `rgb(${lerp(150, 207, d)},${lerp(205, 239, d)},${lerp(235, 250, d)})`; ctx.fillRect(-300, -300, W + 600, H + 600);
  circle(540 + Math.sin(spin) * 420, 300 + (1 - Math.cos(spin)) * 110, 90, G.sun);
  ctx.fillStyle = G.grass; ctx.fillRect(-300, 1040, W + 600, 1200);
  ctx.fillStyle = '#79BF68'; for (let i = 0; i < 9; i++) ctx.fillRect(-100 + i * 150, 1100 + (i % 2) * 40, 90, 14);
  // barn
  rr(800, 760, 230, 290, 6); ctx.fillStyle = C.red; ctx.fill(); ctx.beginPath(); ctx.moveTo(780, 770); ctx.lineTo(915, 660); ctx.lineTo(1050, 770); ctx.closePath(); ctx.fillStyle = '#A81E2C'; ctx.fill(); rr(880, 900, 80, 150, 6); ctx.fillStyle = C.white; ctx.fill();
}
function pig(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ell(0, 0, 100, 68, '#F2A5B4'); for (const lx of [-56, 56]) { rr(lx - 13, 48, 26, 46, 10); ctx.fillStyle = '#E58B9E'; ctx.fill(); } circle(84, -30, 52, '#F2A5B4'); ell(122, -24, 22, 18, '#E58B9E'); circle(74, -44, 8, C.ink); ctx.beginPath(); ctx.moveTo(60, -78); ctx.lineTo(44, -110); ctx.lineTo(92, -82); ctx.closePath(); ctx.fillStyle = '#E58B9E'; ctx.fill(); ctx.restore(); }
function farmer(x, y, s, age, hatY, hic) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line([[-50, 190], [-56, 340]], '#3E5C92', 58); line([[50, 190], [56, 340]], '#3E5C92', 58); ell(-66, 362, 54, 22, '#4A3324'); ell(66, 362, 54, 22, '#4A3324');
  rr(-120, -60, 240, 270, 60); ctx.fillStyle = '#D9533F'; ctx.fill(); rr(-92, 30, 184, 180, 18); ctx.fillStyle = '#4C6FA8'; ctx.fill(); line([[-70, 40], [-60, -56]], '#4C6FA8', 26); line([[70, 40], [60, -56]], '#4C6FA8', 26);
  line([[-118, -10], [-190, 110]], '#D9533F', 48); line([[118, -10], [190, 110]], '#D9533F', 48); circle(-192, 118, 30, '#E2B48C'); circle(192, 118, 30, '#E2B48C');
  ell(0, -170, 112, 120, '#E2B48C');
  const hair = `rgb(${lerp(120, 245, age)},${lerp(80, 245, age)},${lerp(50, 245, age)})`;
  // beard grows with age
  const bl = lerp(40, 620, age);
  ctx.beginPath(); ctx.moveTo(-108, -150); ctx.quadraticCurveTo(-130, -70 + bl * 0.5, 0, -90 + bl); ctx.quadraticCurveTo(130, -70 + bl * 0.5, 108, -150); ctx.quadraticCurveTo(0, -80, -108, -150); ctx.closePath(); ctx.fillStyle = hair; ctx.fill();
  for (const sd of [-1, 1]) { circle(sd * 42, -190, hic ? 24 : 15, hic ? C.white : C.ink); if (hic) circle(sd * 42, -188, 11, C.ink); }
  ell(0, -128, hic ? 22 : 16, hic ? 30 : 6, C.mouth);
  ctx.save(); ctx.translate(0, -272 - hatY); ctx.rotate(hatY * 0.0016); ell(0, 12, 190, 34, '#E8C766'); rr(-104, -80, 208, 96, 40); ctx.fillStyle = '#EBD27E'; ctx.fill(); ctx.fillStyle = C.red; ctx.fillRect(-104, -10, 208, 22); ctx.restore();
  ctx.restore();
}
function baby(x, y, s, hic, breathe, smile) { // newborn lying in a crib, head right
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-260, -80 - breathe * 12, 330, 170 + breathe * 12, 80); ctx.fillStyle = '#FFE08A'; ctx.fill();
  ell(180, -30, 128, 122, '#E6B48E');
  circle(214, -66, hic ? 15 : 10, C.ink); circle(120, -66, hic ? 15 : 10, C.ink);
  if (smile && !hic) { ctx.beginPath(); ctx.arc(166, 10, 34, 0.15 * Math.PI, 0.85 * Math.PI); ctx.strokeStyle = C.mouth; ctx.lineWidth = 9; ctx.stroke(); } else ell(166, 34, hic ? 18 : 14, hic ? 20 : 5, C.mouth);
  ell(170, -148, 14, 22, '#3A2A20', 0.4);
  ctx.restore();
}
function brainGlow(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const [a, b, r] of [[-34, -8, 46], [10, -22, 50], [46, 8, 40], [-14, 26, 42], [24, 30, 34]]) circle(a, b, r, C.pink);
  ctx.strokeStyle = C.pinkDark; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-50, 0); ctx.quadraticCurveTo(0, -30, 50, 4); ctx.moveTo(-30, 30); ctx.quadraticCurveTo(10, 10, 40, 30); ctx.stroke();
  ctx.restore();
}
function rings(x, y, t, n, col) { for (let i = 0; i < n; i++) { const p = ((t * 1.3 + i / n) % 1); ctx.globalAlpha = (1 - p) * 0.9; ctx.beginPath(); ctx.arc(x, y, 90 + p * 360, 0, TAU); ctx.strokeStyle = col; ctx.lineWidth = 16; ctx.stroke(); } ctx.globalAlpha = 1; }
function star(x, y, r, c, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, q = i % 2 ? r * 0.45 : r; ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q); } ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ctx.restore(); }
function confetti(lt) { for (let i = 0; i < 26; i++) { const x = rnd(i) * W, y = (rnd(i + 30) * 500 + lt * (260 + rnd(i + 8) * 200)) % 1400 - 100; ctx.save(); ctx.translate(x, y); ctx.rotate(lt * 4 + i); ctx.fillStyle = [C.yellow, C.cyan, C.white, '#6AB187'][i % 4]; ctx.fillRect(-14, -8, 28, 16); ctx.restore(); } }
function medal(cx, cy) { ctx.beginPath(); ctx.moveTo(cx - 60, cy - 90); ctx.lineTo(cx, cy); ctx.lineTo(cx + 60, cy - 90); ctx.strokeStyle = C.red; ctx.lineWidth = 16; ctx.stroke(); circle(cx, cy + 28, 46, C.yellow); star(cx, cy + 28, 30, '#E8B400', 0); }
function snorkel() { rr(-58, -92, 200, 104, 34); ctx.strokeStyle = C.cyan; ctx.lineWidth = 16; ctx.stroke(); line([[150, -40], [186, -40], [186, -170]], C.red, 24); }
function memoSheet(x, y, r, s) { ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.scale(s, s); rr(-90, -60, 180, 120, 6); ctx.fillStyle = C.white; ctx.fill(); ctx.strokeStyle = '#C9C2B5'; ctx.lineWidth = 5; ctx.stroke(); for (const yy of [-26, 0, 26]) line([[-60, yy], [60, yy]], '#C9C2B5', 7); ctx.restore(); }
function boat(x, y, s, r) { ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-260, -30); ctx.lineTo(260, -30); ctx.lineTo(170, 90); ctx.lineTo(-170, 90); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill(); ctx.restore(); }
function wires(t) { for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-100, 420 + i * 70); for (let x = -100; x <= 1180; x += 30) ctx.lineTo(x, 420 + i * 70 + Math.sin(x * 0.012 * (1 + i * 0.3) + i + t) * (70 + i * 20)); ctx.strokeStyle = [C.red, C.yellow, C.cyan, '#6AB187', '#8A8F9C'][i]; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.stroke(); } }

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // 0 · hook: a tail wiggles out of her mouth in the silent meeting
  { const hit = Wd('ruined', 0) - 0.05;
    add({ id: 'S01', at: 0, cam: [540, 620], zoom: 0.25, note: 'tail out of mouth in meeting',
      draw(lt, d, t) {
        meeting(lt, { eyes: 'wide', mouth: 'o', brow: 1, heroLook: Math.sin(lt * 7), arm: K.armPose(K.ARM.down, K.ARM.mouth, eio(seg(lt, 1.3, 1.7))),
          afterHero: () => { const o = clamp(1 - seg(lt, 1.2, 1.5)); if (o > 0) tad({ x: 556, y: 716 + (1 - o) * 30, s: 0.17 * (0.6 + 0.4 * o), t, eyes: 'wide', m: 0, rot: Math.sin(lt * 9) * 0.12 }); } });
      } });
    add({ id: 'S02', at: hit, cam: [540, 700], zoom: 0.08, note: 'HIC jump, everyone stares',
      draw(lt, d) { const j = Math.sin(clamp(lt / 0.45) * Math.PI) * 170;
        meeting(lt, { jump: j, look: lt > 0.12, wide: lt > 0.12, eyes: 'wide', mouth: 'o', brow: 1, arm: K.ARM.wave, armL: K.ARM.wave });
        K.shockLines(540, 560 - j, 190, clamp(lt * 6)); } });
  }
  // 1 · throat: drop falls, gate slam
  { const st = cut(1), sh = Wd('Shut', 1) - st, g = Wd('gate', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 800], zoom: 0.05, note: 'tadpole yells, gate slams',
      draw(lt, d, t) { const gate = seg(lt, g - 0.05, g + 0.15), a = eio(seg(lt, sh, g + 0.1)), sk = lt > g && lt < g + 0.35 ? Math.sin(lt * 80) * 14 : 0;
        ctx.save(); ctx.translate(sk, 0); throat(t, gate);
        const dy = lerp(-120, 300, seg(lt, 0, g + .05)); if (gate < 0.6) drop(540, dy, 1.2); else drop(540 + (lt - g) * 500, 300 - Math.sin(seg(lt, g, g + .5) * 3.1) * 160, 1.2);
        lever(790, 1170, a, 1.3);
        tad({ x: 400, y: 960, s: 1.15, t, m: talk(t) * 1.4, eyes: 'wide', rot: -0.05 + Math.sin(lt * 18) * 0.03 });
        ctx.restore(); } });
  }
  // 2 · x-ray pullback, tadpole in her neck; "sort of" = he shrugs
  { const st = cut(2), so = Wd('sort', 2) - st;
    add({ id: 'S04', at: st, cam: [540, 620], zoom: 0.14, note: 'x-ray body, tadpole in neck',
      draw(lt, d, t) { fillAll('#DDF5FA');
        K.man({ x: 540, y: 1000, s: 1.25, xray: true, eyes: 'n', mouth: 'flat', brow: 0.6, look: 1 });
        rings(540, 750, t * .7, 2, C.yellow);
        tad({ x: 540, y: 750, s: 0.36, t, m: 0, rot: lt > so ? Math.sin(lt * 12) * 0.14 : 0, eyes: lt > so ? 'closed' : 'n' }); } });
  }
  // 3 · hiccup mechanics
  { const st = cut(3), gu = Wd('gulp', 3) - st, sl = Wd('slams', 3) - st, hi = Wd('Hic', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.1, note: 'lungs gulp, gate slams, hic jump',
      draw(lt, d, t) { fillAll('#DDF5FA');
        const inh = eob(seg(lt, gu - 0.15, gu + 0.25)), j = lt > hi ? Math.sin(seg(lt, hi, hi + 0.35) * Math.PI) * 110 : 0;
        ctx.save(); ctx.translate(0, -j);
        K.man({ x: 540, y: 900, s: 1.25, xray: true, eyes: lt > sl ? 'wide' : 'n', mouth: lt > hi ? 'o' : lt > sl ? 'flat' : 'o', brow: lt > sl ? 1 : .3 });
        for (const sd of [-1, 1]) { ell(540 + sd * 95, 840, lerp(58, 86, inh), lerp(90, 128, inh), C.pink); ell(540 + sd * 104, 815, lerp(20, 30, inh), lerp(36, 52, inh), C.pinkLight); }
        line([[420, lerp(960, 1010, inh)], [540, lerp(930, 985, inh)], [660, lerp(960, 1010, inh)]], C.yellow, 16);
        if (lt < sl) for (let i = 0; i < 3; i++) { const p = (lt * 2.4 + i / 3) % 1; ctx.globalAlpha = seg(lt, gu - .3, gu) * (1 - p); line([[540, lerp(540, 760, p)], [540, lerp(590, 810, p)]], C.white, 22); ctx.globalAlpha = 1; }
        const g = eob(seg(lt, sl - 0.03, sl + 0.12)); for (const sd of [-1, 1]) { rr(540 + sd * lerp(70, 18, g) - 28, 690, 56, 34, 14); ctx.fillStyle = C.red; ctx.fill(); }
        ctx.restore();
        if (lt > hi) K.burst(540, 610 - j, 2.6, 1 - seg(lt, hi + .2, hi + .5)); } });
  }
  // 4 · tadpoles in sync, then the cutaway
  { const st = cut(4), c = Wd('They', 4) - 0.08 - st, g = Wd('gate', 4) - st, w = Wd('water', 4) - st, lu = Wd('lungs', 4) - st, gi = Wd('gills', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 620], zoom: 0.08, note: 'pond chorus line of tadpoles hiccuping in sync',
      draw(lt, d, t) { pond(t); const b = Math.max(0, Math.sin(lt * 9)) ** 3 * 70;
        for (let i = 0; i < 6; i++) { tiny(200 + (i % 3) * 330, 280 + Math.floor(i / 3) * 800 - b, 1.15, t + i * .1, 0); } tad({ x: 600, y: 700 - b, s: .85, t, m: Math.sin(lt * 9) > 0.5 ? .5 : 0 }); } });
    add({ id: 'S07', at: st + c, cam: [540, 700], zoom: 0.06, note: 'cutaway: gate blocks water from lungs',
      draw(lt, d, t) { const gc = eob(seg(lt, g - c - 0.1, g - c + 0.15)), gw = 1 + (lt > gi - c ? Math.sin(lt * 18) * 0.25 : 0), hl = lt > lu - c ? 1 : 0;
        pond(t);
        ctx.save(); ctx.translate(540, 700);
        ctx.beginPath(); ctx.moveTo(-340, -70); for (let i = 1; i <= 10; i++) { const u = i / 10; ctx.lineTo(-340 - u * 380, -70 + u * 70 + Math.sin(u * 5 - t * 9) * 30 * u); } for (let i = 10; i >= 0; i--) { const u = i / 10; ctx.lineTo(-340 - u * 380, 70 - u * 70 + Math.sin(u * 5 - t * 9) * 30 * u); } ctx.closePath(); ctx.fillStyle = G.tail; ctx.fill();
        ell(0, 0, 400, 300, G.body); ell(20, 20, 330, 230, '#F7E7C5');
        // lungs
        for (const yy of [-20, 120]) ell(-130, yy - 10, 130, 50, hl ? C.pink : C.pinkLight);
        // gills
        for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(250 - i * 50, -250); ctx.rotate(-0.4 + i * .15 + Math.sin(t * 9 + i) * .1); ctx.scale(gw, gw); ell(0, -50, 22, 66, C.red); ctx.restore(); }
        // gate: a door dropping across the lung entrance
        rr(30, -150, 40, lerp(60, 300, gc), 16); ctx.fillStyle = C.red; ctx.fill();
        // eye + water streaks hit the gate and bounce up and out through the gills
        circle(270, -130, 40, C.white); circle(282, -128, 20, C.ink);
        for (let i = 0; i < 8; i++) { const p = (lt * 1.6 + i / 8) % 1, a = Math.min(1, p / .55), x = lerp(430, 90, a), y = Math.sin(i * 2) * 60 + 20, bk = p >= .55 ? (p - .55) / .45 : 0; ell(x + bk * 90, y - bk * 300, 22, 13, '#39B8DA'); }
        ctx.restore(); } });
  }
  // 5 · wires, then memo becomes a boat
  { const st = cut(5), an = Wd('and', 5) - st - 0.05, me = Wd('memo', 5) - st;
    add({ id: 'S08', at: st, cam: [540, 800], zoom: 0.06, note: 'ancient tangled wires, tadpole naps',
      draw(lt, d, t) { throat(t, 0, { gy: 180 }); wires(t * 1.5); tad({ x: 620, y: 1000, s: 1, t: t * .3, eyes: 'closed', m: .05 });
        for (let i = 0; i < 3; i++) { const p = (lt * .9 + i / 3) % 1; ell(820 + p * 90, 800 - p * 300, 16 + p * 22, 12 + p * 16, C.white); } } });
    add({ id: 'S09', at: st + an, cam: [540, 900], zoom: 0.08, note: 'memo drifts down, gets folded into a boat',
      draw(lt, d, t) { const m = me - an, f = seg(lt, m + 0.5, m + 1.0); throat(t, 0, { gy: 180 });
        tad({ x: 500, y: f >= 1 ? 960 : 1020, s: 1, t, eyes: lt > m ? 'n' : 'closed', m: 0 });
        if (f < 1) memoSheet(lerp(760, 620, seg(lt, 0, m + .5)) + Math.sin(lt * 4) * 70, lerp(-100, 800, eo(seg(lt, 0, m + .5))), Math.sin(lt * 3) * .5, 1.6 * (1 - f * .4));
        else boat(540, 1130, 1.3, Math.sin(lt * 5) * .05); } });
  }
  // 6 · what's land? snorkel on, in the paper boat
  { const st = cut(6);
    add({ id: 'S10', at: st, cam: [540, 860], zoom: 0.12, note: 'puzzled tadpole',
      draw(lt, d, t) { throat(t, 0, { gy: 180 }); tad({ x: 520, y: 860, s: 1.5, t, m: talk(t) * 1.3, eyes: 'wide', mood: 'puzzled', tilt: 0.1 * Math.sin(lt * 5), specs: false, extra: snorkel }); boat(540, 1160, 1.6, Math.sin(lt * 5) * .05); } });
  }
  // 7 · the farmer
  { const st = cut(7), th = Wd("That's", 7) - 0.08 - st;
    add({ id: 'S11', at: st, cam: [460, 900], zoom: 0.04, note: 'farmer ages through 68 years, sun racing',
      draw(lt, d, t) { const r = seg(lt, 0, th), sp = r * 26, hb = Math.max(0, Math.sin(lt * 15)) ** 2; field(t, sp);
        farmer(420, 780 - hb * 70, 0.92, r * .55, 0, hb > .3); pig(820, 1120 - Math.max(0, Math.sin(lt * 15 - .5)) ** 2 * 120, .9); } });
    add({ id: 'S12', at: st + th, cam: [540, 900], zoom: 0.2, note: 'giant beard, hat in orbit',
      draw(lt, d, t) { const hb = Math.max(0, Math.sin(lt * 22)) ** 2; field(t, 0); pig(860, 1120 - hb * 260, 1);
        farmer(460, 760 - hb * 120, 1.1, lerp(.6, 1, seg(lt, 0, 1.2)), lerp(60, 900, seg(lt, .1, 2)), hb > .3);
        for (let i = 0; i < 16; i++) if (lt > i * .13) star(rnd(i) * W, 180 + rnd(i + 7) * 1000, 34 + rnd(i + 3) * 40, C.yellow, lt * 2 + i); } });
  }
  // 8 · proud
  { const st = cut(8);
    add({ id: 'S13', at: st, cam: [540, 800], zoom: 0.12, note: 'tadpole accepts medal',
      draw(lt, d, t) { throat(t, 0, { gy: 180 }); confetti(lt); tad({ x: 520, y: 840, s: 1.4, t, m: talk(t) * 1.3, eyes: 'closed', rot: -.12, extra: () => medal(40, 150) }); } });
  }
  // 9 · womb, then newborn lesson
  { const st = cut(9), ba = Wd('Babies', 9) - 0.08 - st, an = Wd('And', 9) - 0.08 - st, ea = Wd('each', 9) - 0.08 - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.25, note: 'twist: tadpole freezes',
      draw(lt, d, t) { throat(t, 0, { gy: 180 }); tad({ x: 520, y: 840, s: 1.4, t, m: 0, eyes: 'wide', extra: () => medal(40, 150) }); K.shockLines(560, 620, 250, clamp(lt * 5)); } });
    add({ id: 'S15', at: st + ba, cam: [540, 760], zoom: 0.1, note: 'baby hiccuping in womb',
      draw(lt, d, t) { fillAll(C.stomachFold); circle(540, 760, 500, C.pinkLight); circle(540, 760, 440, '#FBC7CE');
        const hb = Math.max(0, Math.sin(lt * 6.5)) ** 4, bo = hb * 60;
        ctx.save(); ctx.translate(540, 780 - bo); ctx.rotate(-.5);
        ell(-20, 110, 170, 210, '#EDBB97'); circle(20, -150, 165, '#EDBB97'); ell(70, -160, 13, 16, C.ink); ell(-30, -165, 13, 16, C.ink); ell(40, -90, 14, hb > .3 ? 22 : 6, C.mouth);
        line([[-120, 40], [40, 80]], '#E0AA83', 56); line([[-90, 240], [80, 180]], '#E0AA83', 60); ctx.restore();
        K.burst(540, 440 - bo, 1.8, hb > .4 ? hb : 0); } });
    add({ id: 'S16', at: st + an, cam: [540, 760], zoom: 0.06, note: 'newborn in crib, tadpole on the rail',
      draw(lt, d, t) { fillAll('#FFF1DC'); ctx.fillStyle = '#F9D9B0'; ctx.fillRect(-300, 1120, W + 600, 900); rr(90, 780, 900, 300, 40); ctx.fillStyle = '#CFEFFA'; ctx.fill();
        const hb = Math.max(0, Math.sin(lt * 7)) ** 6; baby(480, 950 - hb * 40, 1.25, hb > .3, Math.sin(lt * 3) * .5 + .5, false);
        for (let i = 0; i < 9; i++) { rr(100 + i * 108, 560, 22, 540, 10); ctx.fillStyle = G.wood; ctx.fill(); } rr(80, 540, 920, 36, 16); ctx.fillStyle = G.woodD; ctx.fill();
        tad({ x: 830, y: 450, s: .5, t, eyes: 'wide' }); } });
    add({ id: 'S17', at: st + ea, cam: [560, 860], zoom: 0.14, note: 'each hic sends rings through the newborn brain, chest learns to breathe',
      draw(lt, d, t) { fillAll('#FFF1DC'); ctx.fillStyle = '#F9D9B0'; ctx.fillRect(-300, 1120, W + 600, 900);
        const br = Math.sin(lt * 3.4) * .5 + .5; rings(690, 750, t, 3, C.yellow);
        baby(420, 900, 1.5, Math.sin(lt * 7) > .75, br, true); brainGlow(690, 745, .95);
        for (let i = 0; i < 4; i++) { const p = (lt * 1.1 + i / 4) % 1; ctx.globalAlpha = 1 - p; line([[250, 760 - p * 200], [250, 710 - p * 200]], C.cyan, 18); ctx.globalAlpha = 1; }
        tad({ x: 830, y: 420, s: .62, t, eyes: 'n', m: Math.sin(lt * 8) > 0 ? .3 : 0 }); } });
  }
  // 10 · you're welcome
  { const st = cut(10);
    add({ id: 'S18', at: st, cam: [540, 860], zoom: 0.14, note: 'tadpole wells up',
      draw(lt, d, t) { fillAll('#FFF1DC'); ctx.fillStyle = '#F9D9B0'; ctx.fillRect(-300, 1120, W + 600, 900); tad({ x: 520, y: 800, s: 1.5, t, m: talk(t) * 1.2, eyes: 'closed' }); const p = (lt * 1.2) % 1; drop(470, 780 + p * 320, .55); } });
  }
  // 11 · meeting again, she holds her breath
  { const st = cut(11);
    add({ id: 'S19', at: st, cam: [540, 620], zoom: 0.3, note: 'silent meeting, she holds it in',
      draw(lt, d, t) { meeting(lt, { eyes: 'wide', mouth: 'flat', brow: .8, heroLook: Math.sin(lt * 6), arm: K.armPose(K.ARM.down, K.ARM.mouth, eio(seg(lt, 0, .5))) }); } });
  }
  // 12 · loop: gate slam
  { const st = cut(12), sh = Wd('Shut', 12) - st, g = Wd('gate', 12) - st;
    add({ id: 'S20', at: st, cam: [540, 800], zoom: 0.05, note: 'loop back',
      draw(lt, d, t) { const gate = seg(lt, g - 0.05, g + 0.15), a = eio(seg(lt, sh, g + 0.1)), sk = lt > g ? Math.sin(lt * 80) * 14 : 0;
        ctx.save(); ctx.translate(sk, 0); throat(t, gate);
        lever(790, 1170, a, 1.3); tad({ x: 400, y: 960, s: 1.15, t, m: talk(t) * 1.4, eyes: 'wide', rot: -0.05 + Math.sin(lt * 18) * 0.03 });
        ctx.restore(); } });
  }
  return { shots: S, cues: CUES };
}
