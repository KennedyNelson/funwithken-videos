// Low-poly characters: Claude (faceted apricot slab with a spark crystal) and the Engineer (faceted round head, hoodie).
// Both are rigs driven by a few numbers (see `pose`). Flat shading + simple black face shapes = the "low-poly toy" look.
import * as THREE from 'three';


/** simple rounded box (no addon needed): subdivided box with corners pushed onto spheres of radius r; analytic smooth normals */
function RoundedBoxGeometry(w, h, d, seg = 4, r = 0.04) {
  const n = Math.max(6, seg * 3), g = new THREE.BoxGeometry(w, h, d, n, n, n), p = g.attributes.position, nm = g.attributes.normal;
  const hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), cx = Math.max(-hx, Math.min(hx, x)), cy = Math.max(-hy, Math.min(hy, y)), cz = Math.max(-hz, Math.min(hz, z));
    let dx = x - cx, dy = y - cy, dz = z - cz; const L = Math.hypot(dx, dy, dz) || 1; dx /= L; dy /= L; dz /= L;
    p.setXYZ(i, cx + dx * r, cy + dy * r, cz + dz * r); nm.setXYZ(i, dx, dy, dz);
  }
  return g;
}
const hash = (x, y, z) => { const s = Math.sin(Math.round(x * 997) * 12.9898 + Math.round(y * 997) * 78.233 + Math.round(z * 997) * 37.719) * 43758.5453; return s - Math.floor(s); };
/** a slightly irregular, softly bevelled box: the faceted "slab" look */
export function slab(w, h, d, seg = 2, amp = 0.012, bevel = 0.1) {
  const g = new THREE.BoxGeometry(w, h, d, seg, seg, seg), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i); const nx = x / (w / 2), ny = y / (h / 2), nz = z / (d / 2);
    const k = 1 - bevel * (Math.abs(nx * ny) + Math.abs(ny * nz) + Math.abs(nx * nz)) / 3;
    x *= k; y *= k; z *= k; x += (hash(x, y, z) - 0.5) * amp; y += (hash(y, z, x) - 0.5) * amp; z += (hash(z, x, y) - 0.5) * amp; p.setXYZ(i, x, y, z);
  }
  g.computeVertexNormals(); return g;
}
export const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.72, metalness: 0, ...o });
const basic = (color, o = {}) => new THREE.MeshBasicMaterial({ color, ...o });
const roundedRect = (w, h, r) => { const s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return new THREE.ShapeGeometry(s, 4); };

/** bendable mouth: smile > 0 smiles, < 0 frowns; open 0..1 */
export function makeMouth(width, color = '#1B0F1F') {
  const N = 11, g = new THREE.BufferGeometry(), pos = new Float32Array(N * 2 * 3), idx = [];
  for (let i = 0; i < N - 1; i++) { const a = i * 2, b = a + 1, c = a + 2, d = a + 3; idx.push(a, b, c, b, d, c); }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(idx);
  const m = new THREE.Mesh(g, basic(color, { side: THREE.DoubleSide })); m.frustumCulled = false;
  m.set = (smile, open) => {
    for (let i = 0; i < N; i++) { const u = (i / (N - 1)) * 2 - 1, x = u * width * 0.5, k = 1 - u * u, up = -smile * width * 0.22 * k, thick = 0.012 + open * width * 0.42 * Math.pow(k, 0.7);
      pos[i * 6] = x; pos[i * 6 + 1] = up; pos[i * 6 + 2] = 0; pos[i * 6 + 3] = x; pos[i * 6 + 4] = up - thick; pos[i * 6 + 5] = 0; }
    g.attributes.position.needsUpdate = true;
  }; m.set(0.3, 0); return m;
}

/** CLAUDE */
export function makeClaude() {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const C = '#D97757', CD = C;
  const W = 1.0, H = 0.78, D = 0.62, LEG = 0.26;
  const torso = new THREE.Mesh(slab(W, H, D, 3, 0.018, 0.16), mat(C)); torso.position.y = LEG + H / 2; torso.castShadow = true; body.add(torso);
  for (const [x, z] of [[-0.32, 0.16], [0.32, 0.16], [-0.32, -0.16], [0.32, -0.16]]) { const l = new THREE.Mesh(slab(0.15, LEG + 0.04, 0.15, 1, 0.006, 0.1), mat(CD)); l.position.set(x, (LEG + 0.04) / 2 - 0.02, z); l.castShadow = true; body.add(l); }
  const nub = new THREE.Mesh(slab(0.18, 0.16, 0.2, 1, 0.01, 0.2), mat(CD)); nub.position.set(-W / 2 - 0.07, LEG + H * 0.35, 0.02); nub.rotation.z = 0.25; body.add(nub);
  const nub2 = nub.clone(); nub2.position.x = W / 2 + 0.07; nub2.rotation.z = -0.25; body.add(nub2);
  // face (on the front)
  const face = new THREE.Group(); face.position.set(0, LEG + H * 0.52, D / 2 + 0.018); body.add(face);
  const eyeG = roundedRect(0.1, 0.2, 0.04), hiG = new THREE.PlaneGeometry(0.03, 0.045), EY = [];
  for (const sx of [-1, 1]) { const e = new THREE.Group(); e.position.set(sx * 0.21, 0.07, 0); const m = new THREE.Mesh(eyeG, basic('#150C1C')); e.add(m); const h = new THREE.Mesh(hiG, basic('#FFFFFF')); h.position.set(0.02, 0.055, 0.002); e.add(h); face.add(e); EY.push(e); }
  const brows = []; for (const sx of [-1, 1]) { const b = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.026), basic('#3A1B2E')); b.position.set(sx * 0.21, 0.24, 0); face.add(b); brows.push(b); }
  const cheeks = []; for (const sx of [-1, 1]) { const c = new THREE.Mesh(new THREE.CircleGeometry(0.075, 14), basic('#FF5C86', { transparent: true, opacity: 0 })); c.scale.set(1.2, 0.7, 1); c.position.set(sx * 0.34, -0.09, 0); face.add(c); cheeks.push(c); }
  const mouth = makeMouth(0.15); mouth.position.set(0, -0.06, 0); face.add(mouth);
  // spark crystal, floats above (our twist: a glowing mint gem on a short stalk)
  const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), new THREE.MeshStandardMaterial({ color: '#7CFFD2', emissive: '#4DF5C0', emissiveIntensity: 1.6, flatShading: true, roughness: 0.3 }));
  gem.scale.set(0.8, 1.3, 0.8); gem.visible = false;
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.2, 5), mat(CD)); stalk.visible = false;
  const P = { wink: 0, eyeY: 1, eyeX: 1, look: 0, lookY: 0, brow: 0, browY: 0, smile: 0.4, open: 0, mo: 0.7, bo: 0, tilt: 0, lean: 0, squash: 1, bounce: 0, blush: 0.5, spin: 1, yaw: 0, gemDroop: 0, shake: 0 };
  g.userData = { P, torso, body, gem, stalk };
  g.pose = (p, t, env, talking) => {
    body.rotation.z = p.tilt + p.lean; body.rotation.y = p.yaw; body.scale.set(1 + (1 - p.squash) * 0.5, p.squash, 1 + (1 - p.squash) * 0.5);
    body.position.y = Math.max(0, p.bounce) + (talking ? env * 0.018 : 0) + Math.sin(t * 1.7) * 0.006;
    body.position.x = Math.sin(t * 60) * p.shake;
    const bl = (() => { const x = (t + 1.9) % 4.1; return x < 0.14 ? Math.sin(Math.PI * x / 0.14) : 0; })();
    EY.forEach((e, i) => { e.scale.set(p.eyeX, Math.max(0.05, p.eyeY * (1 - bl * 0.92) * (i === 0 ? 1 - (p.wink || 0) * 0.9 : 1)), 1); e.position.x = Math.sign(e.position.x) * 0.21 + p.look * 0.02; e.position.y = 0.07 + p.lookY * 0.02; });
    brows.forEach((b, i) => { const s = i ? 1 : -1; b.rotation.z = s * p.brow * 0.5; b.position.y = 0.24 + p.browY * 0.05; b.visible = Math.abs(p.brow) > 0.05 || Math.abs(p.browY) > 0.1; });
    mouth.set(p.smile, p.bo + (talking ? env * p.mo : 0));
    gem.rotation.y = t * p.spin * 1.2; gem.position.y = LEG + H + 0.32 + Math.sin(t * 2.2) * 0.03 - p.gemDroop * 0.16; gem.material.emissiveIntensity = 1.2 + 0.6 * Math.sin(t * 4) + (p.spin > 3 ? 0.8 : 0);
    stalk.rotation.z = p.gemDroop * 0.5; stalk.position.x = p.gemDroop * 0.04;
  };
  return g;
}

/** ENGINEER: minimal geometric person made of rounded boxes (no spheres). Square head, navy tee, brown pants, yellow block hair. Faces +z. */
export function makeEngineer(o = {}) {
  const g = new THREE.Group(), SK = o.skin || '#E2A67C', HAIR = o.hair || '#1A1722', TEE = o.tee || '#1B2F6E', PANT = o.pant || '#4A3426', SHOE = '#2E2A36';
  const sm = (c, o = {}) => mat(c, { flatShading: false, roughness: 0.65, ...o });
  const rb = (w, h, d, r = 0.035) => new RoundedBoxGeometry(w, h, d, 4, r);
  const bodyG = new THREE.Group(); g.add(bodyG);
  for (const sx of [-1, 1]) {
    const leg = new THREE.Mesh(rb(0.17, 0.3, 0.17, 0.04), sm(PANT)); leg.position.set(sx * 0.12, -0.72, 0); leg.castShadow = true; g.add(leg);
    const shoe = new THREE.Mesh(rb(0.2, 0.09, 0.3, 0.035), sm(SHOE)); shoe.position.set(sx * 0.12, -0.905, 0.05); shoe.castShadow = true; g.add(shoe);
  }
  const torso = new THREE.Mesh(rb(0.54, 0.46, 0.34, 0.07), sm(TEE)); torso.position.y = -0.46; torso.castShadow = true; bodyG.add(torso);
  const arms = [];
  for (const sx of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(sx * 0.33, -0.33, 0); bodyG.add(sh);
    const up = new THREE.Mesh(rb(0.13, 0.3, 0.13, 0.04), sm(TEE)); up.position.y = -0.14; up.castShadow = true; sh.add(up);
    const el = new THREE.Group(); el.position.y = -0.27; sh.add(el);
    const lo = new THREE.Mesh(rb(0.12, 0.26, 0.12, 0.04), sm(TEE)); lo.position.y = -0.12; el.add(lo);
    const hand = new THREE.Mesh(rb(0.13, 0.13, 0.13, 0.04), sm(SK)); hand.position.y = -0.3; hand.castShadow = true; el.add(hand);
    arms.push({ sh, el });
  }
  // head: a square
  const head = new THREE.Group(); head.position.y = 0.04; bodyG.add(head);
  const skull = new THREE.Mesh(rb(0.64, 0.62, 0.58, 0.09), sm(SK, { roughness: 0.7 })); skull.castShadow = true; head.add(skull);
  for (const sx of [-1, 1]) { const e = new THREE.Mesh(rb(0.06, 0.12, 0.08, 0.02), sm(SK)); e.position.set(sx * 0.34, -0.02, 0); head.add(e); }
  // hair: yellow geometric blocks
  for (const [x, y, w, h] of (o.hairBlocks || [[-0.2, 0.33, 0.22, 0.2], [0.0, 0.37, 0.22, 0.3], [0.2, 0.33, 0.22, 0.22]])) {
    const blk = new THREE.Mesh(rb(w, h, 0.3, 0.04), sm(HAIR)); blk.position.set(x, y, -0.02); blk.castShadow = true; head.add(blk);
  }
  // face
  const face = new THREE.Group(); face.position.set(0, 0.0, 0.295); head.add(face);
  const eyeGeo = new THREE.CircleGeometry(0.058, 24), EY = [], GL = [];
  for (const sx of [-1, 1]) {
    const e = new THREE.Group(); e.position.set(sx * 0.15, 0.02, 0.0); const m = new THREE.Mesh(eyeGeo, basic('#150C1C')); e.add(m); const h = new THREE.Mesh(new THREE.CircleGeometry(0.014, 6), basic('#fff')); h.position.set(0.016, 0.018, 0.002); e.add(h); face.add(e); EY.push(e);
  }
  if (o.specs) { for (const sx of [-1, 1]) for (const [w, h, x, y] of [[0.19, 0.02, 0, 0.09], [0.19, 0.02, 0, -0.07], [0.02, 0.16, -0.095, 0.01], [0.02, 0.16, 0.095, 0.01]]) { const f = new THREE.Mesh(rb(w, h, 0.02, 0.008), sm('#16121C')); f.position.set(sx * 0.15 + x, 0.03 + y, 0.03); face.add(f); } const br = new THREE.Mesh(rb(0.12, 0.02, 0.02, 0.008), sm('#16121C')); br.position.set(0, 0.04, 0.03); face.add(br); }
  const brows = []; for (const sx of [-1, 1]) { const b = new THREE.Mesh(new THREE.PlaneGeometry(0.115, 0.024), basic('#241A47')); b.position.set(sx * 0.15, 0.14, 0.01); face.add(b); brows.push(b); }
  const cheeks = []; for (const sx of [-1, 1]) { const c = new THREE.Mesh(new THREE.CircleGeometry(0.05, 12), basic('#FF5C86', { transparent: true, opacity: 0.3 })); c.scale.set(1.2, 0.7, 1); c.position.set(sx * 0.22, -0.08, 0.0); face.add(c); cheeks.push(c); }
  const mouth = makeMouth(0.12); mouth.position.set(0, -0.12, 0.012); face.add(mouth);
  const sweat = new THREE.Group(); const sd = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5), basic('#8DE9FF')); const sc = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.06, 5), basic('#8DE9FF')); sc.position.y = 0.05; sweat.add(sd, sc); sweat.position.set(0.3, 0.19, 0.06); head.add(sweat);
  const P = { lid: 0, wide: 1, look: 0, lookY: 0, brow: 0, browY: 0, smile: 0, open: 0, mo: 0.8, bo: 0, tilt: 0, yaw: 0, pitch: 0, lean: 0, sw: 0, blush: 0.3, shake: 0, armL: 0, armR: 0, slump: 0 };
  g.pose = (p, t, env, talking) => {
    bodyG.rotation.x = p.lean; bodyG.position.y = -p.slump * 0.06 + (talking ? env * 0.01 : 0) + Math.sin(t * 2.1) * 0.004; bodyG.position.x = Math.sin(t * 58) * p.shake;
    head.rotation.set(p.pitch, p.yaw, p.tilt); head.position.y = 0.04 - p.slump * 0.04;
    const bl = (() => { const x = (t + 0.7) % 3.4; return x < 0.14 ? Math.sin(Math.PI * x / 0.14) : 0; })();
    const ey = Math.max(0.06, (1 - p.lid * 0.92) * p.wide * (1 - bl * 0.92));
    for (const e of EY) { e.scale.set(p.wide, ey, 1); e.position.x = Math.sign(e.position.x) * 0.15 + p.look * 0.012; e.position.y = 0.03 + p.lookY * 0.012 - p.lid * 0.012; }
    brows.forEach((b, i) => { const s = i ? 1 : -1; b.rotation.z = s * p.brow * 0.5; b.position.y = 0.15 + p.browY * 0.03 - p.lid * 0.02; });
    cheeks.forEach((c) => { c.material.opacity = p.blush; });
    mouth.set(p.smile, p.bo + (talking ? env * p.mo : 0));
    sweat.visible = p.sw > 0.05; sweat.scale.setScalar(Math.max(0.01, p.sw)); sweat.position.y = 0.19 - ((t * 0.12) % 0.2) * p.sw;
    { const b = p.belly == null ? 1 : p.belly; torso.scale.set(b, 1 + (b - 1) * 0.3, 1 + (b - 1) * 0.6); torso.position.y = -0.46 - (b - 1) * 0.04; arms.forEach((ar, i) => { ar.sh.position.x = (i ? 1 : -1) * (0.06 + 0.27 * b); }); }
    const a = [p.armL, p.armR];
    arms.forEach((ar, i) => { const sx = i ? 1 : -1, r = a[i]; ar.sh.rotation.set(-0.5 - r * 1.1, 0, sx * (0.2 + r * 0.3)); ar.el.rotation.set(-1.0 - r * 0.4, 0, 0); });
  };
  g.userData = { P, head, arms };
  return g;
}
