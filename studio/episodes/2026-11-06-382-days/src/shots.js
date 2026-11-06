// "382 days" (Neon Pit, bright park): a ginger Scot shrinks while his grumpy Stomach complains; a fridge pops in at the end.
import * as THREE from 'three';
import { clamp, lerp, seg, eio, eob } from './core/lib.js';
import { camera, lightRig } from './core/engine.js';
import { makeEngineer, mat } from './core/chars.js';
import { ENV, TM } from './env.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const lv = (a, b, k) => a.clone().lerp(b, k);
const T = TM.T, FR = TM.A.fridge;
const envS = (t) => ENV.S[Math.round(t * 100)] || 0;
const inL = (ks, t) => ks.some((k) => t >= T[k][0] - 0.05 && t <= T[k][1] + 0.05);

export function buildShots(E) {
  const S = [], add = (o) => (S.push(o), o);
  const SKY = '#BFE3F5';
  const scene = new THREE.Scene(); scene.background = new THREE.Color(SKY); scene.fog = new THREE.Fog(SKY, 16, 46);
  scene.environment = E.envMap; scene.environmentIntensity = 0.3;
  const R = lightRig(scene, { key: '#FFF1DC', keyI: 2.4, keyPos: [-3, 6, 4.5], rimCol: '#FFFFFF', rimI: 0.8, sky: '#CFE8FF', ground: '#7FA860', hemiI: 0.55, shadowBox: 5, target: [0, 0.6, 0] });
  const box = (w, h, d, col, x, y, z, o, parent = scene) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(col, o)); m.position.set(x, y, z); m.receiveShadow = true; m.castShadow = true; parent.add(m); return m; };
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), mat('#58AE45', { roughness: 0.9 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  box(1.8, 0.03, 40, '#D9BF86', 0, 0.015, -6);
  const tree = (x, z, s) => { box(0.2 * s, 1.3 * s, 0.2 * s, '#8A5F3E', x, 0.65 * s, z); box(1.2 * s, 1.0 * s, 1.2 * s, '#4FA05A', x, 1.6 * s, z); box(0.8 * s, 0.8 * s, 0.8 * s, '#62B86A', x, 2.3 * s, z); };
  tree(-3.4, -2.4, 1.5); tree(3.8, -3.0, 1.2); tree(-5.5, -6, 1.8); tree(6.0, -7, 1.6);
  [[-9, -14, 7, 3], [4, -16, 9, 4], [14, -13, 6, 2.5]].forEach(([x, z, w, h]) => box(w, h, 5, '#8CC66F', x, h / 2 - 0.3, z));
  [[-4, 6, -12, 1.2], [3, 7.5, -14, 1.5], [9, 5.5, -10, 1.0]].forEach(([x, y, z, k]) => { box(2.4 * k, 0.5 * k, 0.9 * k, '#FFFFFF', x, y, z); box(1.4 * k, 0.5 * k, 0.9 * k, '#FFFFFF', x + 0.5, y + 0.4 * k, z); });
  // park bench behind them
  box(2.6, 0.12, 0.5, '#B07A44', 0, 0.55, -1.6); box(2.6, 0.5, 0.1, '#B07A44', 0, 0.9, -1.85); box(0.1, 0.55, 0.4, '#6B4A2B', -1.2, 0.27, -1.6); box(0.1, 0.55, 0.4, '#6B4A2B', 1.2, 0.27, -1.6);

  // the man: ginger Scot, fair skin, green tee, grey pants
  const man = makeEngineer({ skin: '#F0BE9A', hair: '#C4601F', tee: '#2F7D55', pant: '#3A3F4D', hairBlocks: [[-0.2, 0.34, 0.22, 0.2], [0.02, 0.4, 0.3, 0.3], [0.22, 0.33, 0.2, 0.22], [-0.3, 0.1, 0.1, 0.3], [0.3, 0.1, 0.1, 0.3]] });
  man.position.set(-0.5, 0.95, 0); man.rotation.y = 0.45; scene.add(man);
  // Stomach: small pink person, big grumpy face
  const SC = 0.72;
  const stom = makeEngineer({ skin: '#F6A7B8', hair: '#F6A7B8', tee: '#F28BA3', pant: '#E8738F', hairBlocks: [] });
  stom.scale.setScalar(SC); stom.position.set(0.62, 0.95 * SC, 0.15); stom.rotation.y = -0.45; scene.add(stom);
  [man, stom].forEach((c) => c.traverse((o) => { if (o.isMesh) o.castShadow = true; }));
  // fridge (hidden until the last line)
  const fridge = new THREE.Group(); fridge.position.set(1.25, 0, -0.9); fridge.rotation.y = -0.4; fridge.scale.setScalar(0.001); scene.add(fridge);
  box(1.0, 1.9, 0.85, '#F4F6F8', 0, 0.95, 0, { roughness: 0.4 }, fridge); box(0.96, 0.03, 0.02, '#B9C3CC', 0, 1.25, 0.43, {}, fridge);
  box(0.05, 0.38, 0.06, '#9AA7B2', 0.38, 1.55, 0.46, {}, fridge); box(0.05, 0.45, 0.06, '#9AA7B2', 0.38, 0.85, 0.46, {}, fridge);

  const D = { lid: 0, wide: 1, look: 0, lookY: 0, brow: 0, browY: 0, smile: 0, bo: 0, mo: 0.8, tilt: 0, yaw: 0, pitch: 0, lean: 0, sw: 0, blush: 0.3, shake: 0, armL: 0.05, armR: 0.05, slump: 0 };
  const TH = T.N3[0] + 2.2, TH2 = T.N3[1] - 0.4; // belly shrinks across "he lost over a hundred kilos"
  const belly = (t) => 2.1 - 1.15 * eio(seg(t, T.N3[0] + 2.4, T.N3[0] + 4.6));
  const poseMan = (t) => {
    const thin = t > T.N3[1];
    const base = { ...D, belly: belly(t), look: -1, yaw: 0.25 };
    if (inL(['S1'], t)) return { ...base, lid: 0.45, slump: 0.6, smile: -0.2, brow: -0.2, browY: 0.5, pitch: 0.08 };
    if (inL(['S2'], t)) return { ...base, lid: 0.3, smile: -0.35, slump: 0.4, brow: 0.2, browY: -0.1, yaw: 0.35, look: 1 };
    if (inL(['S3'], t)) return { ...base, lid: 0.6, slump: 0.8, smile: -0.1, tilt: 0.06, pitch: 0.12 };
    if (inL(['N3'], t) && t > T.N3[0] + 4.4) return { ...base, lid: 0, wide: 1.25, smile: 0.5, browY: 0.6, brow: 0.2, armL: 0.7 * eob(clamp((t - T.N3[0] - 4.4) / 0.4)), armR: 0.7 * eob(clamp((t - T.N3[0] - 4.4) / 0.4)) };
    if (inL(['N4'], t)) return { ...base, smile: 0.8, slump: 0.1, wide: 1.1, armL: 0.3, armR: 0.3, yaw: -0.1, look: 0 };
    if (inL(['N5'], t)) return { ...base, smile: t > FR ? 0.2 : 0.3, wide: t > FR ? 1.35 : 1, look: t > FR ? 1 : 0, yaw: -0.3 };
    if (inL(['S4'], t)) return { ...base, wide: 1.45, smile: 0.7, brow: 0.2, browY: 0.9, look: 1, yaw: -0.5 };
    return { ...base, smile: -0.1, lid: 0.25, slump: 0.3 };
  };
  const poseStom = (t) => {
    const talk = inL(['S1', 'S2', 'S3', 'S4'], t);
    if (inL(['S4'], t)) return { ...D, wide: 1.5, smile: 0.9, browY: 0.9, mo: 1.3, look: 1, yaw: 0.2 };
    if (talk) return { ...D, brow: -0.6, browY: 0.6, smile: -0.5, mo: 1.3, yaw: -0.15, look: -1, sw: inL(['S1'], t) ? 0 : 0, lid: inL(['S1', 'S3'], t) ? 0.25 : 0 };
    return { ...D, brow: -0.4, browY: 0.3, smile: -0.4, look: inL(['N2', 'N3', 'N4'], t) ? -1 : 0, yaw: -0.2 };
  };
  const setWorld = (t) => {
    man.pose(poseMan(t), t, 0, false); stom.pose({ ...poseStom(t), belly: 1.7 }, t, envS(t), inL(['S1', 'S2', 'S3', 'S4'], t));
    // little hops while the stomach complains
    stom.position.y = 0.95 * SC + (inL(['S2'], t) ? Math.abs(Math.sin(t * 9)) * 0.05 : 0);
    const k = eob(clamp((t - FR) / 0.5)); fridge.scale.setScalar(Math.max(0.001, k));
    man.scale.set(1, 1, 1);
  };
  const cam = camera(34);
  const LOOK = { aperture: 0.0042, maxblur: 0.012, bloom: 0, bloomThreshold: 1.5, exposure: 0.95, vignette: 0.22, grain: 0.02, warm: 0 };
  const shot = (at, id, o) => add({ id, at, draw(lt, d, t, blit) {
    setWorld(t); const k = eio(clamp(lt / d)); cam.fov = o.fov; cam.updateProjectionMatrix();
    const look = o.look.clone(), p = lv(o.a, o.b, k);
    cam.position.copy(p); cam.up.set(0, 1, 0); cam.lookAt(look); if (o.roll) cam.rotateZ(o.roll); cam.updateMatrixWorld();
    E.render(scene, cam, { ...LOOK, focus: cam.position.distanceTo(look), t: t * 7 }); blit();
  } });
  const c = (k) => T[k][0] - 0.08;
  const LK = V3(0.05, 0.72, 0);
  shot(0, 'wide', { a: V3(0.1, 1.2, 6.2), b: V3(0.05, 1.15, 5.4), look: LK, fov: 40, roll: -0.02 });
  shot(c('S1'), 's1', { a: V3(0.5, 1.15, 5.6), b: V3(0.3, 1.1, 5.0), look: LK, fov: 40, roll: 0.03 });
  shot(c('N2'), 'n2', { a: V3(-0.5, 1.3, 6.0), b: V3(-0.1, 1.2, 5.4), look: LK, fov: 40, roll: -0.02 });
  shot(c('S2'), 's2', { a: V3(0.6, 1.05, 5.4), b: V3(0.3, 1.05, 4.9), look: LK, fov: 40, roll: -0.04 });
  shot(c('N3'), 'n3', { a: V3(0.0, 1.2, 6.0), b: V3(0.0, 1.1, 5.0), look: LK, fov: 40 });
  shot(c('S3'), 's3', { a: V3(-0.4, 1.0, 5.4), b: V3(0.2, 1.0, 4.9), look: LK, fov: 40, roll: 0.03 });
  shot(c('N4'), 'n4', { a: V3(0.0, 1.3, 6.0), b: V3(0.25, 1.25, 5.4), look: LK, fov: 40 });
  shot(c('N5'), 'n5', { a: V3(0.2, 1.25, 6.4), b: V3(0.4, 1.25, 6.0), look: V3(0.2, 0.45, 0), fov: 40 });
  shot(T.S4[0] - 0.15, 's4', { a: V3(0.5, 1.2, 6.8), b: V3(0.4, 1.15, 6.3), look: V3(0.3, 0.45, 0), fov: 40 });
  return { shots: S, cues: [] };
}
