// Polished Desi Toon sets and props: painted Indian street (for blurred backgrounds), auto rickshaw, tea stall, wallet, Rs 10 note.
import { ctx, OUT, dark, light, mix, cel, blob, poly, ell, fillEll, fillPoly, fillSmooth, line, rrect, layer, blurred, lerp, clamp, shadowBlob } from './toon.js';
const LW = 5;
// ---------- painted street (3200 x 1500), drawn once ----------
function house(x, base, w, h, wall, roof, k) {
  const c = ctx();
  poly([[x, base], [x, base - h], [x + w, base - h], [x + w, base]], wall, () => { fillPoly([[x + w * .72, base - h], [x + w, base - h], [x + w, base], [x + w * .72, base]], dark(wall, .12)); c.save(); c.globalAlpha = .18; for (let i = 0; i < 6; i++) fillEll(x + 40 + i * w / 6, base - h * .35 - (i % 2) * 60, 40, 16, '#5a4030'); c.restore() }, 4);
  if (roof) poly([[x - 30, base - h], [x + w * .5, base - h - 120], [x + w + 30, base - h]], roof, () => { for (let i = 0; i < 9; i++) line([[x - 20 + i * (w + 40) / 9, base - h], [x + w * .5, base - h - 118]], 3, dark(roof, .2), false) }, 4);
  else { poly([[x - 16, base - h - 22], [x + w + 16, base - h - 22], [x + w + 16, base - h], [x - 16, base - h]], light(wall, .25), null, 4); for (let i = 0; i < Math.floor(w / 60); i++) poly([[x + 10 + i * 60, base - h - 70], [x + 30 + i * 60, base - h - 70], [x + 30 + i * 60, base - h - 22], [x + 10 + i * 60, base - h - 22]], light(wall, .3), null, 3) }
  const rows = Math.max(1, Math.floor(h / 230));
  for (let r = 0; r < rows; r++) for (let i = 0; i < Math.max(1, Math.floor(w / 190)); i++) {
    const wx = x + 50 + i * 190, wy = base - h + 60 + r * 230; if (wy + 130 > base - 40) continue;
    poly([[wx, wy], [wx + 110, wy], [wx + 110, wy + 130], [wx, wy + 130]], '#3B5568', () => { fillPoly([[wx, wy], [wx + 50, wy], [wx + 20, wy + 130], [wx, wy + 130]], 'rgba(255,255,255,.18)') }, 4);
    poly([[wx - 10, wy - 16], [wx + 120, wy - 16], [wx + 120, wy], [wx - 10, wy]], light(wall, .2), null, 3);
    for (let b = 0; b < 4; b++) line([[wx + 14 + b * 28, wy + 6], [wx + 14 + b * 28, wy + 124]], 3, '#2b2b2b', false);
  }
  if (k % 2 === 0) { const dx = x + w * .5 - 60; poly([[dx, base], [dx, base - 210], [dx + 120, base - 210], [dx + 120, base]], k % 4 ? '#7A4A2A' : '#2F6E7E', () => fillPoly([[dx + 60, base], [dx + 60, base - 210], [dx + 120, base - 210], [dx + 120, base]], 'rgba(0,0,0,.15)'), 4) }
}
function tree(x, base, s, col) { line([[x, base], [x + 6, base - 260 * s]], 22 * s, '#5C3D24'); for (const [dx, dy, r] of [[0, -330, 120], [-90, -260, 90], [95, -270, 95], [10, -230, 80]]) ell(x + dx * s, base + dy * s, r * s, r * .85 * s, col, () => fillEll(x + dx * s + 30 * s, base + dy * s + 30 * s, r * .7 * s, r * .5 * s, dark(col, .18)), 4) }
export function streetLayer() {
  return layer('street', 3200, 1500, () => {
    const c = ctx();
    const g = c.createLinearGradient(0, 0, 0, 1100); g.addColorStop(0, '#7EC8F2'); g.addColorStop(1, '#D7EEF7'); c.fillStyle = g; c.fillRect(0, 0, 3200, 1500);
    for (const [x, y, s] of [[300, 220, 1], [1300, 160, .8], [2300, 260, 1.1], [2900, 180, .7]]) for (const [a, b, r] of [[0, 0, 80], [90, -26, 100], [190, 10, 80], [100, 34, 90]]) fillEll(x + a * s, y + b * s, r * s, r * .62 * s, '#FFFFFF');
    const pal = [['#F2B35A', '#B8452F'], ['#E57A8E', null], ['#5FB7A5', null], ['#F6D88A', '#A14A30'], ['#9CB7E8', null], ['#E89A5A', '#7F3B26'], ['#C7E07A', null], ['#F1C9A5', '#B8452F']];
    let x = -40, k = 0; while (x < 3200) { const [wall, roof] = pal[k % pal.length]; const w = 330 + (k * 97) % 220, h = 420 + (k * 131) % 360; house(x, 1100, w, h, wall, roof, k); if (k % 3 === 1) tree(x + w + 30, 1110, .9 + (k % 2) * .25, k % 2 ? '#4FA45A' : '#5DB35E'); x += w + (k % 3 === 1 ? 120 : 20); k++ }
    // power line
    for (let i = 0; i < 6; i++) { const px = 200 + i * 560; line([[px, 1110], [px, 380]], 14, '#6b6b6b', false); line([[px - 50, 420], [px + 50, 420]], 8, '#6b6b6b', false) }
    for (let j = 0; j < 2; j++) { c.beginPath(); for (let i = 0; i < 6; i++) { const px = 200 + i * 560; if (!i) c.moveTo(px - 40, 424 + j * 10); else c.quadraticCurveTo(px - 280, 500 + j * 10, px - 40, 424 + j * 10) } c.lineWidth = 3; c.strokeStyle = '#3a3a3a'; c.stroke() }
    // pavement + road
    c.fillStyle = '#CDB79A'; c.fillRect(0, 1100, 3200, 70); line([[0, 1100], [3200, 1100]], 4);
    const rg = c.createLinearGradient(0, 1170, 0, 1500); rg.addColorStop(0, '#7C7774'); rg.addColorStop(1, '#5E5957'); c.fillStyle = rg; c.fillRect(0, 1170, 3200, 330);
    for (let i = 0; i < 16; i++) { c.fillStyle = '#EDE6D6'; c.fillRect(i * 220, 1330, 120, 14) }
  });
}
export const streetBlur = (px = 14) => blurred('streetB' + px, streetLayer(), px);
// draw the blurred street scrolled by off (px). With speed > 0 a motion blur smear is added.
export function drawStreet(off, y0 = 0, scale = 1, speed = 0, px = 14) {
  const c = ctx(), img = streetBlur(px), w = img.width * scale;
  const n = speed > 0 ? 7 : 1;
  for (let k = 0; k < n; k++) { const sm = speed > 0 ? (k / (n - 1) - .5) * Math.min(160, speed * .06) : 0; c.save(); c.globalAlpha = speed > 0 ? (k === Math.floor(n / 2) ? 1 : .22) : 1; let x = -(((off + sm) % w) + w) % w; while (x < 1080 + w) { c.drawImage(img, x - w * 0, y0, w, img.height * scale); x += w } c.restore() }
  c.save(); const hz = c.createLinearGradient(0, y0, 0, y0 + 1100 * scale); hz.addColorStop(0, 'rgba(255,240,215,.0)'); hz.addColorStop(1, 'rgba(255,236,205,.25)'); c.fillStyle = hz; c.fillRect(0, y0, 1080, 1100 * scale); c.restore();
}
// ---------- auto rickshaw (side view, facing LEFT). origin: ground between the wheels. ~900 wide, ~800 tall ----------
const AG = '#1F8F4A', AY = '#F6C21C', CH = '#C9D3DC';
function autoWheel(x, r, rot) {
  const c = ctx();
  ell(x, -r, r, r, '#222', () => { for (let i = 0; i < 18; i++) { const a = rot + i / 18 * 6.283; line([[x + Math.cos(a) * r * .86, -r + Math.sin(a) * r * .86], [x + Math.cos(a) * r, -r + Math.sin(a) * r]], 4, '#3a3a3a', false) } }, LW);
  ell(x, -r, r * .58, r * .58, CH, () => fillEll(x + r * .15, -r + r * .15, r * .45, r * .45, '#9aa6b0'), 4);
  for (let i = 0; i < 5; i++) { const a = rot + i / 5 * 6.283; fillEll(x + Math.cos(a) * r * .34, -r + Math.sin(a) * r * .34, r * .08, r * .08, '#4a5560') }
  ell(x, -r, r * .16, r * .16, '#5a6670', null, 3);
}
export function autoBack(t) { // hood underside, seats, rear panel inner (drawn before passengers)
  // interior shade under the hood
  fillPoly([[-330, -300], [-300, -720], [330, -740], [420, -560], [400, -300]], 'rgba(20,28,24,.55)');
  // rear passenger bench + back cushion
  poly([[40, -330], [330, -330], [330, -300], [40, -300]], '#3A2A22', null, 4);
  poly([[290, -560], [350, -560], [356, -330], [296, -330]], '#4A342A', () => fillPoly([[330, -560], [356, -560], [356, -330], [330, -330]], '#2e201a'), 4);
  // driver seat
  poly([[-230, -360], [-110, -360], [-110, -330], [-230, -330]], '#3A2A22', null, 4);
  poly([[-130, -520], [-96, -520], [-96, -340], [-130, -340]], '#4A342A', null, 4);
}
export function autoFront(t, wr = 0) { // body panels, cowl, windscreen, pillars, hood top, wheels (drawn after passengers)
  const c = ctx();
  shadowBlob(0, 4, 470, 26, .28);
  autoWheel(250, 74, wr); autoWheel(-380, 62, wr * 1.2);
  // main lower body
  poly([[-310, -80], [-310, -330], [300, -330], ['q', 410, -330, 420, -240], [420, -90], ['q', 410, -60, 380, -60], [330, -60], ['q', 330, -150, 250, -150], ['q', 170, -150, 170, -60], [-300, -60]], AG, () => {
    fillPoly([[-320, -150], [430, -150], [430, -50], [-320, -50]], dark(AG, .2)); fillPoly([[-320, -330], [430, -330], [430, -312], [-320, -312]], light(AG, .25));
    fillPoly([[-310, -262], [420, -262], [420, -232], [-310, -232]], AY); fillPoly([[-310, -236], [420, -236], [420, -232], [-310, -232]], dark(AY, .25));
  }, LW);
  // mudguard over rear wheel
  poly([[160, -60], ['q', 160, -170, 250, -172], ['q', 340, -170, 342, -60], [326, -60], ['q', 322, -150, 250, -152], ['q', 178, -150, 176, -60]], '#1a1a1a', null, 3);
  // front cowl / nose
  poly([[-300, -60], [-300, -470], ['q', -360, -470, -400, -430], ['q', -470, -360, -480, -250], ['q', -484, -170, -450, -120], ['q', -440, -84, -420, -60], ['q', -430, -130, -380, -132], ['q', -326, -130, -322, -60]], AG, () => {
    fillPoly([[-500, -200], [-300, -200], [-300, -40], [-500, -40]], dark(AG, .2)); fillEll(-410, -380, 40, 70, light(AG, .2), .5);
    fillPoly([[-470, -262], [-300, -262], [-300, -232], [-482, -232]], AY);
  }, LW);
  // front mudguard
  poly([[-450, -100], ['q', -440, -150, -380, -150], ['q', -320, -150, -310, -100], [-326, -100], ['q', -336, -134, -380, -134], ['q', -424, -134, -434, -100]], '#1a1a1a', null, 3);
  // headlight + indicator
  ell(-466, -330, 26, 30, CH, () => { fillEll(-466, -330, 17, 21, '#FFF6CC'); fillEll(-472, -338, 6, 8, '#FFFFFF') }, 4);
  ell(-470, -270, 11, 9, '#F59A23', null, 3);
  // windscreen (glass + frame)
  const ws = [[-300, -470], [-360, -470], [-336, -750], [-292, -750]];
  c.save(); c.globalAlpha = .35; fillPoly(ws, '#BFE4F7'); c.restore();
  c.save(); c.globalAlpha = .5; fillPoly([[-348, -620], [-340, -720], [-330, -720], [-338, -620]], '#FFFFFF'); c.restore();
  c.beginPath(); c.moveTo(-300, -470); c.lineTo(-360, -470); c.lineTo(-336, -750); c.lineTo(-292, -750); c.closePath(); c.lineWidth = 12; c.strokeStyle = '#1a1a1a'; c.lineJoin = 'round'; c.stroke();
  line([[-350, -500], [-330, -650]], 4, '#2a2a2a', false);
  // handlebar + mirror
  line([[-300, -470], [-250, -505], [-205, -500]], 10, '#2a2a2a'); ell(-205, -500, 14, 10, '#2a2a2a', null, 3);
  line([[-318, -520], [-345, -640]], 6, '#555', false); ell(-352, -660, 22, 30, '#2a2a2a', () => fillEll(-356, -664, 14, 20, '#9FC9E0'), 3);
  // pillars
  for (const [x0, x1] of [[20, 26], [392, 360]]) line([[x0, -330], [x1, -735]], 14, '#16502C', false);
  // rear quarter panel
  poly([[350, -330], [356, -560], ['q', 400, -560, 420, -520], [420, -330]], AG, () => fillPoly([[392, -560], [430, -560], [430, -330], [392, -330]], dark(AG, .22)), LW);
  // grab rail
  line([[60, -410], [270, -410]], 7, CH, false); line([[60, -410], [60, -340]], 6, CH, false); line([[270, -410], [270, -340]], 6, CH, false);
  // hood (canvas roof)
  poly([[-306, -742], ['q', -300, -830, -150, -840], [300, -846], ['q', 420, -840, 430, -720], [436, -560], [404, -556], [398, -716], ['q', 390, -800, 296, -806], [-150, -800], ['q', -268, -796, -282, -740]], AY, () => { fillPoly([[-320, -790], [440, -790], [440, -740], [-320, -740]], dark(AY, .15)); fillEll(60, -836, 300, 8, light(AY, .35)); for (let i = 0; i < 5; i++) line([[-180 + i * 120, -840], [-180 + i * 120, -800]], 3, dark(AY, .25), false) }, LW);
  // tail light + bumper
  poly([[418, -300], [436, -300], [436, -250], [418, -250]], '#D83A2E', null, 3);
  line([[350, -66], [440, -66]], 10, CH, false);
  // number plate (no readable text)
  poly([[400, -210], [436, -210], [436, -160], [400, -160]], '#F2F2F2', () => line([[406, -185], [430, -185]], 3, '#999', false), 3);
}
// ---------- tea stall (world coords; counter top at y=CT) ----------
export const CT = 1420, CH2 = 360;
export function stallBack(t) {
  const c = ctx();
  // back wall + shelves
  poly([[-300, 420], [1380, 420], [1380, CT], [-300, CT]], '#E8D3A8', () => { fillPoly([[-300, 420], [1380, 420], [1380, 520], [-300, 520]], 'rgba(90,60,30,.18)') }, 0);
  for (const sy of [640, 860]) {
    poly([[-60, sy], [1140, sy], [1140, sy + 22], [-60, sy + 22]], '#8B5A2B', () => fillPoly([[-60, sy + 12], [1140, sy + 12], [1140, sy + 22], [-60, sy + 22]], '#6b4420'), 4);
    for (let i = 0; i < 7; i++) { const x = -20 + i * 165, col = ['#E85D3C', '#F2B233', '#7CC36B', '#E88AB0', '#F2B233', '#5FB7D6', '#E85D3C'][i];
      poly([[x, sy], [x + 8, sy - 150], [x + 112, sy - 150], [x + 120, sy]], 'rgba(220,240,245,.85)', () => { for (let k = 0; k < 6; k++) fillEll(x + 25 + (k % 3) * 35, sy - 26 - Math.floor(k / 3) * 34, 16, 13, col); fillPoly([[x + 12, sy - 150], [x + 30, sy - 150], [x + 22, sy], [x + 8, sy]], 'rgba(255,255,255,.4)') }, 4);
      ell(x + 60, sy - 154, 58, 14, dark(col, .1), null, 4) }
  }
  // hanging snack strips (no text)
  for (let i = 0; i < 6; i++) { const x = 40 + i * 180; line([[x, 330], [x, 380]], 3, '#555', false); for (let k = 0; k < 4; k++) poly([[x - 34, 380 + k * 52], [x + 34, 380 + k * 52], [x + 34, 426 + k * 52], [x - 34, 426 + k * 52]], ['#F2C14E', '#E8543C', '#4DB6AC', '#9C6ADE', '#F28C28', '#5C9DED'][i], () => fillPoly([[x - 34, 380 + k * 52], [x - 10, 380 + k * 52], [x - 10, 426 + k * 52], [x - 34, 426 + k * 52]], 'rgba(255,255,255,.35)'), 3) }
  // tin roof edge
  poly([[-300, 230], [1380, 230], [1380, 330], [-300, 330]], '#8FA6B4', () => { for (let i = 0; i < 40; i++) line([[-300 + i * 44, 230], [-300 + i * 44, 330]], 4, '#6F8694', false); fillPoly([[-300, 300], [1380, 300], [1380, 330], [-300, 330]], 'rgba(0,0,0,.18)') }, 5);
  for (const x of [-10, 1090]) poly([[x - 16, 330], [x + 16, 330], [x + 16, CT], [x - 16, CT]], '#7A4A24', () => fillPoly([[x + 4, 330], [x + 16, 330], [x + 16, CT], [x + 4, CT]], '#5e3818'), 4);
}
export function chaiGlass(x, y, s = 1, fill = .8, steam = 0, t = 0) {
  const c = ctx(); c.save(); c.translate(x, y); c.scale(s, s);
  c.save(); c.globalAlpha = .55; fillPoly([[-30, -86], [30, -86], [22, 0], [-22, 0]], '#E8F4FA'); c.restore();
  if (fill > 0) fillPoly([[-28 + 6 * (1 - fill), -80 + 76 * (1 - fill)], [28 - 6 * (1 - fill), -80 + 76 * (1 - fill)], [22, -2], [-22, -2]], '#B9773D');
  for (let i = 0; i < 5; i++) line([[-24 + i * 12, -70], [-20 + i * 10, -6]], 2, 'rgba(255,255,255,.5)', false);
  c.beginPath(); c.moveTo(-30, -86); c.lineTo(-22, 0); c.lineTo(22, 0); c.lineTo(30, -86); c.lineWidth = 4; c.strokeStyle = OUT; c.stroke();
  if (steam) { c.save(); c.globalAlpha = .6 * steam; for (let i = 0; i < 2; i++) { const ph = t * 2.6 + i * 2; line([[-10 + i * 20, -96], [-22 + i * 20 + Math.sin(ph) * 10, -140], [-6 + i * 20, -190]], 7, '#FFFFFF') } c.restore() }
  c.restore();
}
export function samosa(x, y, s = 1) { poly([[x - 52 * s, y], [x, y - 70 * s], [x + 52 * s, y]], '#E3A23B', () => { fillPoly([[x, y - 70 * s], [x + 52 * s, y], [x + 10 * s, y]], '#C47F22'); for (let i = 0; i < 4; i++) fillEll(x - 22 * s + i * 14 * s, y - 16 * s - (i % 2) * 12 * s, 3 * s, 3 * s, '#A9661A') }, 4) }
export function stallFront(t) { // counter, samosa box, stove, kettle, tray
  const c = ctx();
  poly([[-300, CT], [1380, CT], [1380, CT + CH2], [-300, CT + CH2]], '#9B5E2E', () => { for (let i = 0; i < 9; i++) line([[-300 + i * 200, CT + 30], [-300 + i * 200, CT + CH2]], 5, '#7A4622', false); fillPoly([[-300, CT + CH2 - 70], [1380, CT + CH2 - 70], [1380, CT + CH2], [-300, CT + CH2]], 'rgba(0,0,0,.2)') }, 5);
  poly([[-320, CT - 22], [1400, CT - 22], [1400, CT + 30], [-320, CT + 30]], '#C9D3DC', () => fillPoly([[-320, CT + 14], [1400, CT + 14], [1400, CT + 30], [-320, CT + 30]], '#8D99A4'), 5);
  // samosa glass box
  c.save(); poly([[70, CT - 22], [90, CT - 230], [470, CT - 230], [490, CT - 22]], 'rgba(205,235,248,.55)', () => { fillPoly([[90, CT - 230], [150, CT - 230], [120, CT - 22], [70, CT - 22]], 'rgba(255,255,255,.35)') }, 5); c.restore();
  for (const [x, y] of [[150, -30], [250, -30], [350, -30], [420, -30], [200, -100], [300, -100], [390, -100]]) samosa(x, CT + y, 1);
  line([[86, CT - 120], [474, CT - 120]], 4, 'rgba(60,60,60,.6)', false);
  c.save(); c.translate(420, 0);
  // stove + flame + kettle
  poly([[640, CT - 70], [900, CT - 70], [900, CT - 22], [640, CT - 22]], '#3d3d3d', null, 4);
  for (let i = 0; i < 6; i++) { const fx = 700 + i * 26, fh = 20 + Math.sin(t * 20 + i) * 6; poly([[fx - 10, CT - 70], [fx, CT - 70 - fh], [fx + 10, CT - 70]], '#4FA8F0', null, 0) }
  poly([[650, CT - 80], ['q', 640, CT - 260, 770, CT - 270], ['q', 900, CT - 260, 890, CT - 80]], '#B7C2CB', () => { fillEll(840, CT - 170, 40, 100, '#8C99A4'); fillEll(700, CT - 190, 18, 60, '#E8EEF2') }, 5);
  ell(770, CT - 272, 70, 16, '#9AA6B0', null, 4); ell(770, CT - 290, 22, 14, '#2a2a2a', null, 3);
  line([[650, CT - 200], ['q'], [590, CT - 260], [570, CT - 300]].filter(p => p.length === 2), 14, '#9AA6B0');
  c.beginPath(); c.moveTo(690, CT - 250); c.bezierCurveTo(700, CT - 360, 850, CT - 360, 860, CT - 250); c.lineWidth = 10; c.strokeStyle = '#2a2a2a'; c.stroke();
  c.restore();
  // tray with glasses
  c.save(); c.translate(-400, 0);
  poly([[960, CT - 30], [1180, CT - 30], [1170, CT - 18], [970, CT - 18]], '#C9D3DC', null, 4);
  for (let i = 0; i < 4; i++) chaiGlass(990 + i * 52, CT - 30, .55, i % 2 ? .8 : 0, 0, t);
  c.restore();
}
export function bench(x, y, w = 560) { poly([[x, y], [x + w, y], [x + w, y + 40], [x, y + 40]], '#A0682F', () => fillPoly([[x, y + 22], [x + w, y + 22], [x + w, y + 40], [x, y + 40]], '#7d4f22'), 5); for (const lx of [x + 40, x + w - 60]) poly([[lx, y + 40], [lx + 22, y + 40], [lx + 22, y + 240], [lx, y + 240]], '#7d4f22', null, 4) }
// ---------- wallet macro ----------
export function note10(x, y, s, rot) {
  const c = ctx(); c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  poly([[-190, -92], [-60, -104], [70, -86], [190, -98], [196, 82], [70, 94], [-70, 76], [-196, 92]], '#E2A06E', () => {
    fillPoly([[-196, 30], [196, 18], [196, 94], [-196, 94]], '#C9844F');
    for (let i = 0; i < 9; i++) line([[-170 + i * 40, -80], [-150 + i * 40, 80]], 2, 'rgba(140,70,30,.25)', false);
    fillEll(-90, 0, 56, 56, '#F0C29A'); fillEll(-90, 0, 40, 40, '#E2A06E');
    line([[-140, -60], [-100, 60]], 3, 'rgba(120,60,20,.35)'); line([[40, -80], [10, 70]], 3, 'rgba(120,60,20,.35)');
  }, 5);
  c.font = '900 96px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#6E3414'; c.fillText('10', 90, 6);
  c.restore();
}
export function wallet(open, t, skin) {
  const c = ctx();
  // inside
  poly([[160, 640], [920, 640], [920, 1180], [160, 1180]], '#5B321B', () => { fillPoly([[160, 640], [920, 640], [920, 700], [160, 700]], '#4a2814') }, 6);
  poly([[200, 700], [880, 700], [880, 1140], [200, 1140]], '#7A4526', () => { for (let i = 0; i < 3; i++) fillPoly([[200, 760 + i * 36], [880, 760 + i * 36], [880, 770 + i * 36], [200, 770 + i * 36]], '#5d3219') }, 4);
  c.setLineDash([10, 10]); c.beginPath(); c.roundRect(214, 714, 652, 412, 10); c.lineWidth = 3; c.strokeStyle = '#C89A6A'; c.stroke(); c.setLineDash([]);
  const o = clamp(open);
  if (o > .45) note10(540, 960, lerp(.7, 1, clamp((o - .45) / .55)), -.07 + Math.sin(t * 2.4) * .01);
  // flap swinging open (left side)
  c.save(); c.translate(160, 910); c.scale(Math.max(.02, Math.cos(o * Math.PI * .9)), 1);
  poly([[0, -270], [380, -270], [380, 270], [0, 270]], '#8A4E2B', () => { fillPoly([[300, -270], [380, -270], [380, 270], [300, 270]], '#6e3c1f'); c.setLineDash([10, 10]); c.beginPath(); c.roundRect(16, -254, 348, 508, 10); c.lineWidth = 3; c.strokeStyle = '#C89A6A'; c.stroke(); c.setLineDash([]) }, 6);
  c.restore();
  // thumbs
  for (const x of [150, 930]) ell(x, 1080, 70, 60, skin, () => fillEll(x + 16, 1096, 50, 40, dark(skin, .2)), 5);
  // dust motes floating out
  if (o > .7) { const u = clamp((o - .7) / .3); c.save(); c.globalAlpha = .9 * (1 - u * .5); for (let i = 0; i < 4; i++) fillEll(470 + i * 50 + Math.sin(t * 4 + i) * 10, 820 - u * 220 - i * 26, 7, 7, '#EADCC4'); c.restore() }
}
