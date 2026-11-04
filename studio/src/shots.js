// KennyExplains: "Change the button to blue" (Neon Pit style). World + poses + the shot list.
import * as THREE from 'three';
import { clamp, lerp, seg, eio } from './core/lib.js';
import { camera, lightRig } from './core/engine.js';
import { makeClaude, makeEngineer, mat } from './core/chars.js';
import { drawApp } from './core/app.js';

export const EV = { FP: 3.95, WIPE: 4.6, BR: 7.9, JIC: 9.25, RESTORE: 13.1, CHAT: 18.25 };
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const lv = (a, b, k) => a.clone().lerp(b, k);

function codeTexture(seed, w = 640, h = 900, title) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const c = cv.getContext('2d');
  c.fillStyle = '#0E0B22'; c.fillRect(0, 0, w, h); c.fillStyle = '#1B1540'; c.fillRect(0, 0, w, 64); c.fillStyle = '#B8A8FF'; c.font = '700 30px Inter'; c.fillText(title, 24, 42);
  const cols = ['#7CFFD2', '#FF8FB8', '#9CB8FF', '#FFD98A', '#C8B6FF', '#6B6A9A']; let s = seed;
  const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  c.font = '600 26px monospace';
  for (let y = 100; y < h - 20; y += 38) { let x = 24 + Math.floor(r() * 3) * 28; for (let k = 0; k < 2 + Math.floor(r() * 4); k++) { const len = 3 + Math.floor(r() * 10); c.fillStyle = cols[Math.floor(r() * cols.length)]; c.fillRect(x, y - 18, len * 15, 22); x += len * 15 + 14; if (x > w - 60) break; } }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function neonTexture() {
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 256; const c = cv.getContext('2d'); c.clearRect(0, 0, 1024, 256);
  c.font = '800 104px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.shadowColor = '#FF3FA4'; c.shadowBlur = 40; c.fillStyle = '#FF6CBA'; c.fillText('@KennyExplains', 512, 132); c.shadowBlur = 14; c.fillStyle = '#FFE3F2'; c.fillText('@KennyExplains', 512, 132);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function buildShots(E, tl, env) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#0A0616'); scene.fog = new THREE.FogExp2('#0A0616', 0.045);
  scene.environment = E.envMap; scene.environmentIntensity = 0.16;
  const R = lightRig(scene, { key: '#FFB59E', keyI: 2.7, keyPos: [-2.6, 3.4, 3.6], rimCol: '#3DE7FF', rimI: 3.4, sky: '#7A5BD6', ground: '#160C30', hemiI: 0.5, shadowBox: 3.2, target: [0, 0.6, 0] });
  R.rim.position.set(3, 2.6, -3);
  const pm = new THREE.PointLight('#FF4FA3', 14, 6); pm.position.set(-2.3, 1.6, -1.2); scene.add(pm);
  const pc = new THREE.PointLight('#3DE7FF', 10, 6); pc.position.set(2.5, 1.6, -0.8); scene.add(pc);
  const pf = new THREE.PointLight('#A9B8FF', 7, 5); pf.position.set(0, 1.4, 1.2); scene.add(pf);
  // room
  const box = (w, h, d, col, x, y, z, o) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(col, o)); m.position.set(x, y, z); m.receiveShadow = true; m.castShadow = true; scene.add(m); return m; };
  box(6.4, 0.14, 2.4, '#33276B', 0, -0.07, 0); box(6.4, 1.7, 0.1, '#1F1642', 0, -0.95, 1.15); box(0.14, 1.7, 2.4, '#1F1642', -3.2, -0.95, 0); box(0.14, 1.7, 2.4, '#1F1642', 3.2, -0.95, 0);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), mat('#0C0720', { roughness: 0.5 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -1.8; floor.receiveShadow = true; scene.add(floor);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(30, 14), new THREE.MeshBasicMaterial({ color: '#100A26' })); wall.position.set(0, 3, -7); scene.add(wall);
  box(1.0, 0.04, 0.36, '#1A1235', -0.9, 0.02, 0.62); box(0.22, 0.22, 0.22, '#FF7AA8', -2.0, 0.11, 0.6);
  // screens
  const appCv = document.createElement('canvas'); appCv.width = 1024; appCv.height = 760; const appCx = appCv.getContext('2d');
  const appTex = new THREE.CanvasTexture(appCv); appTex.colorSpace = THREE.SRGBColorSpace; appTex.anisotropy = 4;
  const mon = new THREE.Group(); mon.position.set(0, 2.25, -1.9); scene.add(mon);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(3.05, 2.3, 0.1), mat('#251C52')); frame.position.z = -0.06; mon.add(frame);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 2.15), new THREE.MeshBasicMaterial({ map: appTex, color: 0xb4b4c4, toneMapped: false })); mon.add(scr);
  const sideL = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.1), new THREE.MeshBasicMaterial({ map: codeTexture(7, 640, 900, 'Triage inbox (12 new)'), toneMapped: false })); sideL.position.set(-2.7, 1.9, -2.5); sideL.rotation.y = 0.5; scene.add(sideL);
  const sideR = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.1), new THREE.MeshBasicMaterial({ map: codeTexture(31, 640, 900, 'Diff: 9 files, +412 -87'), toneMapped: false })); sideR.position.set(2.7, 1.8, -2.6); sideR.rotation.y = -0.5; scene.add(sideR);
  for (let i = 0; i < 46; i++) { const r = (n) => { const x = Math.sin(i * 91.7 + n * 12.9) * 43758.5; return x - Math.floor(x); }; const col = ['#3DE7FF', '#FF4FA3', '#FFC857', '#7CFFD2'][i % 4]; const m = new THREE.Mesh(new THREE.SphereGeometry(0.05 + r(3) * 0.04, 6, 5), new THREE.MeshBasicMaterial({ color: col, toneMapped: false })); m.position.set((r(1) - 0.5) * 11, 0.2 + r(2) * 4.4, -4 - r(4) * 5); scene.add(m); }
  // characters
  const eng = makeEngineer(), cl = makeClaude(); eng.position.set(-0.85, 0.95, -0.35); eng.rotation.y = 0.1; cl.position.set(0.85, 0, 0.2); cl.rotation.y = -0.25; scene.add(eng, cl);
  eng.traverse((o) => { if (o.isMesh) o.castShadow = true; });

  // ---------- poses over time ----------
  const DE = { lid: 0, wide: 1, look: 0, lookY: 0, brow: 0, browY: 0, smile: 0, bo: 0, mo: 0.8, tilt: 0, yaw: 0.2, pitch: 0, lean: 0, sw: 0, blush: 0.3, shake: 0, armL: 0, armR: 0, slump: 0 };
  const DC = { wink: 0, eyeY: 1, eyeX: 1, look: 0, lookY: 0, brow: 0, browY: 0, smile: 0.4, bo: 0, mo: 0.7, tilt: 0, lean: 0, squash: 1, bounce: 0, blush: 0, spin: 1, yaw: 0, gemDroop: 0, shake: 0 };
  const KE = [], KC = [], ke = (t, o) => KE.push({ t, p: { ...DE, ...o } }), kc = (t, o) => KC.push({ t, p: { ...DC, ...o } });
  ke(0, { wide: 1.15, brow: .9, browY: -.2, smile: -.5, mo: 1.4, bo: .1, shake: .01, armL: .75, armR: .75, yaw: .15 });
  ke(3.0, { lid: .15, brow: .55, smile: -.35, armL: .15, armR: .15, yaw: .25, look: 1, shake: 0 });
  ke(4.75, { wide: 1.2, brow: .95, browY: -.2, smile: -.55, mo: 1.4, bo: .1, shake: .008, armL: .8, armR: .8, yaw: .15 });
  ke(6.55, { wide: 1.05, brow: -.35, browY: .5, smile: -.15, armL: .15, armR: .15, yaw: .25, look: 1 });
  ke(8.2, { wide: 1.15, brow: -.5, browY: .8, smile: -.2, yaw: .25, look: 1, sw: .4 });
  ke(10.3, { wide: 1.2, brow: -.55, browY: .9, tilt: .09, smile: -.1, mo: .9, bo: .05, armL: .35, armR: .2, yaw: .2, sw: .5 });
  ke(11.6, { wide: 1.25, brow: -.7, browY: 1.0, smile: -.15, yaw: .25, look: 1, sw: .7 });
  ke(15.1, { wide: 1.3, brow: -.8, browY: 1.1, smile: -.1, bo: .15, mo: .5, slump: .2, yaw: .2, sw: .6 });
  ke(16.5, { lid: .35, brow: -.45, smile: -.2, slump: .6, look: 1, yaw: .3, blush: 1, sw: 1, pitch: .08 });
  ke(18.1, { lid: .55, brow: -.35, smile: .1, slump: .85, pitch: .15, look: 1, yaw: .3, blush: 1, sw: 1, tilt: -.06 });
  kc(0, { smile: .3, look: -1, yaw: -.3, eyeY: .9 });
  kc(3.15, { eyeY: .85, smile: .05, mo: .6, tilt: .03, yaw: -.3 });
  kc(4.8, { eyeY: .9, smile: .15, look: -1, yaw: -.3 });
  kc(6.65, { eyeY: 1.1, smile: .25, mo: .8, tilt: .06, brow: .2, yaw: -.25 });
  kc(10.2, { eyeY: .9, smile: .2, look: -1, yaw: -.3 });
  kc(11.7, { eyeY: .55, smile: .55, mo: .7, tilt: .05, brow: .25, yaw: -.25 });
  kc(15.0, { eyeY: .7, smile: .35, look: -1, yaw: -.3 });
  kc(17.0, { eyeY: .55, smile: .85, tilt: .07, mo: .7, yaw: -.25 });
  kc(19.6, { eyeY: .5, smile: 1, tilt: .08, wink: 1, yaw: -.3 });
  function evalKeys(K, t) { let i = 0; while (i + 1 < K.length && K[i + 1].t <= t) i++; const cur = K[i], prev = K[Math.max(0, i - 1)], f = i === 0 ? 1 : eio(seg(t, cur.t, cur.t + 0.35)), p = {}; for (const k in cur.p) p[k] = lerp(prev.p[k], cur.p[k], f); return p; }
  const lineAt = (t) => { for (const l of tl) if (t >= l.start - 0.05 && t <= l.end + 0.05) return l; return null; };
  const envAt = (t) => env[Math.round(t * 100)] || 0;
  function setWorld(t) {
    const l = lineAt(t), ev = envAt(t);
    eng.pose(evalKeys(KE, t), t, ev, l && l.speaker === 'ENGINEER'); cl.pose(evalKeys(KC, t), t, ev, l && l.speaker === 'CLAUDE');
    const info = drawApp(appCx, t, EV); appTex.needsUpdate = true; mon.scale.setScalar(1 + 0.03 * info.bloat);
  }

  // ---------- shots ----------
  const cam = camera(34), HEAD = V3(-0.85, 0.91, -0.35), FACE = V3(0.85, 0.64, 0.2), MON = V3(0, 2.2, -1.9);
  const LOOK = { aperture: 0.0042, maxblur: 0.012, bloom: 0, bloomThreshold: 1.5, exposure: 1.05, vignette: 0.55, grain: 0.03, warm: 0 };
  const shot = (at, id, note, o) => { add({ id, at, note, draw(lt, d, t, blit) {
    setWorld(t); const k = eio(clamp(lt / d)); cam.fov = o.fov; cam.updateProjectionMatrix();
    const look = o.la ? lv(o.la, o.lb, k) : o.look.clone(), far = o.far ?? 1.3, p = lv(o.a, o.b, k); p.sub(look).multiplyScalar(far).add(look); if (o.shake) { p.x += Math.sin(t * 47) * o.shake; p.y += Math.cos(t * 39) * o.shake; }
    cam.position.copy(p); cam.up.set(0, 1, 0); cam.lookAt(look); if (o.roll) cam.rotateZ(o.roll); cam.updateMatrixWorld();
    E.render(scene, cam, { ...LOOK, focus: o.focus ?? cam.position.distanceTo(look), t: t * 7, ...(o.look2 || {}) }); blit();
  } }); cue(at, 'whoosh', { gain: 0.5 }); };
  const MONS = { a: V3(0.3, 1.8, 5.2), b: V3(0.05, 1.95, 4.2) };
  shot(0, 'S01', 'engineer rage: Claude, I just lost a week of code. You are sh*t!', { a: V3(-0.15, 1.17, 2.4), b: V3(-0.4, 1.12, 2.0), look: HEAD, fov: 34, roll: -0.05, shake: 0.008 });
  shot(3.2, 'S02', 'Claude deadpan: Did you run force push?', { a: V3(0.2, 0.7, 2.9), b: V3(0.45, 0.66, 2.6), look: FACE, fov: 38, roll: 0.05 });
  shot(3.9, 'S03', 'monitor: git push --force, commits to 0', { ...MONS, look: V3(0, 1.75, -1.9), fov: 46, far: 0.9 });
  shot(4.8, 'S04', 'engineer defensive: Dont blame me!', { a: V3(-0.5, 1.02, 1.9), b: V3(-0.7, 0.99, 1.4), look: V3(-0.85, 0.95, -0.35), fov: 36, shake: 0.01, roll: -0.04 });
  shot(6.7, 'S05', 'Claude calm: Quick question', { a: V3(0.6, 0.6, 2.5), b: V3(0.8, 0.6, 2.0), look: FACE, fov: 36, roll: -0.05 });
  shot(7.75, 'S06', 'monitor: git branch -a, just-in-case', { a: V3(-0.3, 1.8, 5.0), b: V3(0, 2.0, 4.2), look: V3(0, 1.85, -1.9), fov: 46, far: 0.9 });
  shot(10.3, 'S07', 'engineer confused: Thats not mine', { a: V3(-0.1, 1.07, 2.3), b: V3(-0.45, 1.02, 1.75), look: HEAD, fov: 32, roll: 0.05 });
  shot(11.7, 'S08', 'Claude smug: It is now', { a: V3(0.35, 0.72, 2.9), b: V3(0.55, 0.68, 2.5), look: FACE, fov: 38, roll: 0.05 });
  shot(12.9, 'S09', 'monitor: checkout just-in-case, 47 restored', { a: V3(0.5, 1.9, 5.0), b: V3(0.2, 2.0, 3.9), look: V3(0.1, 1.85, -1.9), fov: 44, far: 0.9 });
  shot(15.0, 'S10', 'engineer stunned then ashamed', { a: V3(-0.2, 0.97, 2.6), b: V3(-0.5, 0.92, 2.1), look: V3(-0.85, 0.85, -0.35), fov: 34, roll: -0.05 });
  shot(17.0, 'S11', 'Claude warm: Everything.', { a: V3(0.2, 0.7, 2.9), b: V3(0.45, 0.66, 2.6), look: FACE, fov: 38, roll: -0.05 });
  shot(18.2, 'S12', 'monitor: saved chat log', { a: V3(0.4, 1.9, 4.8), b: V3(0.1, 2.0, 4.0), look: V3(0, 1.85, -1.9), fov: 44, far: 0.9 });
  shot(19.75, 'S13', 'Claude wink', { a: V3(0.35, 0.72, 2.9), b: V3(0.55, 0.68, 2.5), look: FACE, fov: 38, roll: 0.05 });
  cue(EV.FP, 'pop', { gain: .6 }); cue(EV.WIPE, 'thud', { gain: .9 }); cue(EV.BR, 'pop', { gain: .6 }); cue(EV.JIC, 'sparkle', { gain: .7 }); cue(EV.RESTORE + .7, 'sparkle', { gain: .8 }); cue(EV.CHAT, 'pop', { gain: .7 });
  return { shots: S, cues: CUES };
}
