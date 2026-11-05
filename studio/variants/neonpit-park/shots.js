// Kalu & Bettery (Neon Pit): dark cinematic toy diorama, no glow, rounded-box people, one cut per spoken line.
import * as THREE from 'three';
import { clamp, lerp, seg, eio } from './core/lib.js';
import { camera, lightRig } from './core/engine.js';
import { makeEngineer, mat } from './core/chars.js';
import { ENV, TM } from './env.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const lv = (a, b, k) => a.clone().lerp(b, k);
const T = TM.T, KT = TM.A.kick;
const envAt = (who, t) => { const a = ENV[who === 'K' ? 'B' : 'K'], i = Math.round(t * 100); return (a[i] || 0); };   // data keys are swapped
const inLine = (keys, t) => keys.some((k) => t >= T[k][0] - 0.05 && t <= T[k][1] + 0.05);

export function buildShots(E) {
  const S = [], add = (o) => (S.push(o), o);
  const SKY = '#BFE3F5';
  const scene = new THREE.Scene(); scene.background = new THREE.Color(SKY); scene.fog = new THREE.Fog(SKY, 16, 46);
  scene.environment = E.envMap; scene.environmentIntensity = 0.3;
  const R = lightRig(scene, { key: '#FFF1DC', keyI: 2.4, keyPos: [-3, 6, 4.5], rimCol: '#FFFFFF', rimI: 0.8, sky: '#CFE8FF', ground: '#7FA860', hemiI: 0.55, shadowBox: 4, target: [0, 0.6, 0] });
  const box = (w, h, d, col, x, y, z, o) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(col, o)); m.position.set(x, y, z); m.receiveShadow = true; m.castShadow = true; scene.add(m); return m; };
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), mat('#58AE45', { roughness: 0.9 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  box(1.6, 0.03, 40, '#D9BF86', 0, 0.015, -6);
  const tree = (x, z, s) => { box(0.2 * s, 1.3 * s, 0.2 * s, '#8A5F3E', x, 0.65 * s, z); box(1.2 * s, 1.0 * s, 1.2 * s, '#4FA05A', x, 1.6 * s, z); box(0.8 * s, 0.8 * s, 0.8 * s, '#62B86A', x, 2.3 * s, z); };
  tree(-3.2, -2.2, 1.5); tree(3.4, -3.0, 1.2); tree(-5.5, -6, 1.8); tree(6.0, -7, 1.6);
  [[-9, -14, 7, 3], [4, -16, 9, 4], [14, -13, 6, 2.5]].forEach(([x, z, w, h]) => box(w, h, 5, '#8CC66F', x, h / 2 - 0.3, z));
  [[-4, 6, -12, 1.2], [3, 7.5, -14, 1.5], [9, 5.5, -10, 1.0]].forEach(([x, y, z, k]) => { box(2.4 * k, 0.5 * k, 0.9 * k, '#FFFFFF', x, y, z); box(1.4 * k, 0.5 * k, 0.9 * k, '#FFFFFF', x + 0.5, y + 0.4 * k, z); });
  box(0.4, 0.2, 0.4, '#E9C84A', -1.6, 0.1, 0.9); box(0.3, 0.16, 0.3, '#E96A8C', 1.5, 0.08, 0.8);

  const kalu = makeEngineer({ skin: '#7A4C33', hair: '#14111A', tee: '#D9822B', pant: '#2C3350', hairBlocks: [[-0.18, 0.33, 0.26, 0.16], [0.08, 0.35, 0.3, 0.2], [0.24, 0.31, 0.16, 0.14]] });
  const bett = makeEngineer({ skin: '#E8B58C', hair: '#14111A', tee: '#3C6FB6', pant: '#4A3F36', specs: true, hairBlocks: [[-0.2, 0.34, 0.2, 0.2], [0.02, 0.38, 0.28, 0.26], [0.22, 0.31, 0.2, 0.14]] });
  kalu.position.set(-0.6, 0.95, 0); kalu.rotation.y = 0.55; bett.position.set(0.6, 0.95, 0); bett.rotation.y = -0.55; scene.add(kalu, bett);
  [kalu, bett].forEach((c) => c.traverse((o) => { if (o.isMesh) o.castShadow = true; }));

  const D = { lid: 0, wide: 1, look: 0, lookY: 0, brow: 0, browY: 0, smile: 0, bo: 0, mo: 0.8, tilt: 0, yaw: 0, pitch: 0, lean: 0, sw: 0, blush: 0, shake: 0, armL: 0.05, armR: 0.05, slump: 0 };
  const poseK = (t) => ({ ...D, brow: -0.55, browY: 0.8, smile: -0.4, lid: 0.18, slump: 0.45, pitch: 0.12, yaw: 0.35, look: inLine(['B1', 'Bq', 'B2'], t) ? 1 : 0, lookY: inLine(['B1', 'Bq', 'B2'], t) ? 0 : -1, tilt: -0.04, armL: 0.08, armR: 0.08 });
  const poseB = (t) => {
    if (t >= KT) { const u = eio(clamp((t - KT) / 0.35)); return { ...D, lid: 0.55 * u, brow: 0.25 * u, browY: -0.3 * u, smile: -0.45 * u, slump: 0.7 * u, pitch: 0.2 * u, yaw: -0.3, look: 0, lookY: -1, tilt: Math.sin((t - KT) * 3.2) * 0.04 * u, mo: 0 }; }
    return { ...D, brow: t < 5.7 ? -0.4 : 0.1, browY: t < 5.7 ? 0.6 : 0, smile: t < 5.7 ? -0.1 : 0.05, yaw: -0.3, look: -1, armL: 0.1, armR: 0.1 };
  };
  const setWorld = (t) => {
    kalu.pose(poseK(t), t, envAt('K', t), inLine(['K1', 'K2', 'K3'], t)); bett.pose(poseB(t), t, envAt('B', t), t < KT && inLine(['B1', 'Bq', 'B2'], t));
  };
  const cam = camera(34);
  const LOOK = { aperture: 0.0042, maxblur: 0.012, bloom: 0, bloomThreshold: 1.5, exposure: 0.95, vignette: 0.22, grain: 0.02, warm: 0 };
  const HK = V3(-0.6, 1.0, 0), HB = V3(0.6, 1.0, 0);
  const shot = (at, id, o) => add({ id, at, draw(lt, d, t, blit) {
    setWorld(t); const k = eio(clamp(lt / d)); cam.fov = o.fov; cam.updateProjectionMatrix();
    const look = o.la ? lv(o.la, o.lb, k) : o.look.clone(), p = lv(o.a, o.b, k);
    if (o.shake) { p.x += Math.sin(t * 47) * o.shake; p.y += Math.cos(t * 39) * o.shake; }
    cam.position.copy(p); cam.up.set(0, 1, 0); cam.lookAt(look); if (o.roll) cam.rotateZ(o.roll); cam.updateMatrixWorld();
    E.render(scene, cam, { ...LOOK, focus: cam.position.distanceTo(look), t: t * 7 }); blit();
  } });
  const c = (k) => T[k][0] - 0.06;
  const MID = V3(0, 1.0, 0);
  shot(0, 'wide', { a: V3(0.2, 1.5, 6.0), b: V3(0, 1.4, 5.2), look: MID, fov: 40, roll: -0.02 });
  shot(c('K1'), 'k1', { a: V3(-0.9, 1.3, 5.4), b: V3(-0.5, 1.2, 4.8), look: MID, fov: 40, roll: 0.03 });
  shot(c('Bq'), 'bq', { a: V3(0.9, 1.3, 5.4), b: V3(0.5, 1.2, 4.8), look: MID, fov: 40, roll: -0.03 });
  shot(c('K2'), 'k2', { a: V3(-1.0, 1.1, 5.0), b: V3(-0.3, 1.15, 4.5), look: MID, fov: 40, roll: 0.04 });
  shot(c('B2'), 'b2', { a: V3(1.0, 1.1, 5.0), b: V3(0.3, 1.15, 4.5), look: MID, fov: 40, roll: -0.04 });
  shot(c('K3'), 'k3', { a: V3(0.0, 1.2, 5.6), b: V3(0.0, 1.15, 4.8), look: MID, fov: 40 });
  shot(KT - 0.04, 'react', { a: V3(0.0, 1.15, 4.8), b: V3(0.3, 1.1, 4.4), look: MID, fov: 40 });
  return { shots: S, cues: [] };
}
