// KALU & BETTERY (Tall Tale 3D variant): two flat cartoon friends on a sunny meadow, camera always moving.
import * as THREE from 'three';
import { clamp, lerp } from './core/lib.js';
import { L, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import { Toon } from './core/toon.js';
import { ENV, TM } from './env.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const env = (who, t) => { const a = ENV[who === 'K' ? 'B' : 'K'], i = Math.floor(t * 100); return i >= 0 && i < a.length ? clamp(a[i] * 1.25) : 0; };
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);

export function buildShots(E) {
  const S = [], add = (o) => (S.push(o), o);
  const cam = camera(36);
  const KT = TM.A.kick, END = TM.A.end;
  const LOOKFX = { bloom: 0.2, aperture: 0.0012, maxblur: 0.008 };
  const MD = WD.meadow(E, { fenceOn: false });
  MD.sun.key.position.set(6, 12, 8); MD.sun.key.target.position.set(0, 0, 0);
  const kalu = new Toon({ body: '#E8873A', head: '#8A5A3D', hat: 'crop' });
  const bett = new Toon({ body: '#3C6FB6', head: '#F7F7FA', hat: 'crop', extra: ['glasses'] });
  kalu.at(-0.95, 0, 0); bett.at(0.95, 0, 0);
  MD.scene.add(kalu.group, bett.group);

  const poseK = (t) => {
    const sp = env('K', t), hearing = t < 2.1 || (t > 4.6 && t < 5.7) || (t > 10.1 && t < 12.6);
    return { mood: 'worried', look: hearing ? [0.7, 0.2] : [0.2, 0.7], blink: blink(t, 0.4), talk: sp, tears: 0,
      armL: [6 + Math.sin(t * 1.3) * 3, 8], armR: [6 + Math.cos(t * 1.1) * 3, 8], lean: Math.sin(t * 1.2) * 1.2 - 1.5, bob: Math.sin(t * 2) * 3 + sp * 4 };
  };
  const poseB = (t) => {
    const sp = env('B', t);
    if (t >= KT) { const u = clamp((t - KT) / 0.4); return { mood: 'tired', look: [-0.3, 0.8], blink: 0, talk: 0, armL: [6, 6], armR: [6, 6], lean: 3 * Math.sin((t - KT) * 3.2) * u, bob: 8 * u };
    }
    const mood = t < 5.7 ? 'worried' : 'neutral';
    return { mood, look: [-0.6, 0.1], blink: blink(t, 1.1), talk: sp, armL: [8, 6], armR: [8 + sp * 10, 10 + sp * 20], lean: Math.sin(t * 1.4) * 1.5 + 1, bob: Math.sin(t * 2.3) * 3 + sp * 4 };
  };

  const shot = (id, at, from, to, la, lb, fov = 36) => add({ id, at, draw(lt, d, t, blit) {
    kalu.set(poseK(t)); bett.set(poseB(t));
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
    const k = clamp(lt / d), ke = k * k * (3 - 2 * k) * 0.6 + k * 0.4;
    cam.position.copy(mix(from, to, ke)); const at2 = mix(la, lb, ke); cam.lookAt(at2);
    kalu.face(cam); bett.face(cam);
    E.render(MD.scene, cam, { ...LOOKFX, focus: cam.position.distanceTo(at2) });
    blit();
  } });
  const c = (i) => L(i) - 0.06;
  shot('two', 0, V3(0.4, 1.35, 9.8), V3(-0.1, 1.4, 8.4), V3(0, 1.25, 0), V3(0, 1.3, 0));
  shot('kalu1', c(1), V3(-0.4, 1.5, 4.6), V3(-0.8, 1.5, 3.6), V3(-0.95, 1.4, 0), V3(-0.95, 1.45, 0));
  shot('bett1', c(2), V3(0.5, 1.5, 4.2), V3(0.9, 1.5, 3.4), V3(0.95, 1.4, 0), V3(0.95, 1.45, 0));
  shot('kalu2', c(3), V3(-0.5, 1.55, 3.4), V3(-0.9, 1.55, 2.5), V3(-0.95, 1.45, 0), V3(-0.95, 1.45, 0));
  shot('bett2', c(4), V3(0.5, 1.55, 3.4), V3(0.9, 1.55, 2.6), V3(0.95, 1.45, 0), V3(0.95, 1.45, 0));
  shot('kalu3', c(5), V3(-0.4, 1.55, 3.8), V3(-0.8, 1.55, 3.0), V3(-0.95, 1.45, 0), V3(-0.95, 1.45, 0));
  shot('react', KT - 0.04, V3(0.7, 1.55, 3.2), V3(1.0, 1.55, 2.3), V3(0.95, 1.45, 0), V3(0.95, 1.42, 0));
  return { shots: S, cues: [] };
}
