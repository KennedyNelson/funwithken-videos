// Brown Dude model sheet v2 (reference image). Not a video.
import { W, H, bind } from '../toon/toon.js';
import { brownDude, bdHead, plate, PLATES } from '../toon/brownDude.js';
export const DUR = 1; let c;
export function init(cx) { c = cx; bind(c) }
export function draw(t) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); plate(PLATES.blue);
  c.font = '900 60px Inter'; c.textAlign = 'center'; c.fillStyle = '#1b1b1b'; c.fillText('BROWN DUDE', W / 2, 100);
  brownDude({ x: 300, y: 1170, s: 1.0, pose: 'stand', expr: 'focused' });
  c.lineWidth = 14; c.strokeStyle = '#E9EEF2'; c.beginPath(); c.moveTo(600, 262); c.lineTo(1050, 262); c.stroke(); c.lineWidth = 3; c.strokeStyle = '#1A1411'; c.strokeRect(600, 255, 450, 14);
  brownDude({ x: 825, y: 1205, s: .76, pose: 'hang', expr: 'angry', sweat: true });
  const ex = ['focused', 'angry', 'tired', 'shocked'];
  ex.forEach((e, i) => { c.save(); c.translate(140 + i * 265, 1480); c.scale(1.35, 1.35); bdHead({ expr: e, talk: e === 'angry' ? .7 : 0 }); c.restore(); c.font = '700 30px Inter'; c.fillStyle = '#333'; c.fillText(e, 140 + i * 265, 1640) });
  c.save(); c.translate(540, 1890); c.scale(.0, .0); c.restore();
  c.restore();
}
export const cues = [];
