// Brown Dude model sheet v3 (reference image). Not a video.
import { W, H, bind } from '../toon/toon.js';
import { brownDude, bdHead, plate, PLATES } from '../toon/brownDude.js';
export const DUR = 1; let c;
export function init(cx) { c = cx; bind(c) }
export function draw(t) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); plate(PLATES.blue);
  c.font = '900 60px Inter'; c.textAlign = 'center'; c.fillStyle = '#1b1b1b'; c.fillText('BROWN DUDE', W / 2, 96);
  brownDude({ x: 290, y: 1300, s: 1.0, pose: 'stand', expr: 'happy' });
  c.lineWidth = 14; c.strokeStyle = '#E9EEF2'; c.beginPath(); c.moveTo(600, 236); c.lineTo(1060, 236); c.stroke(); c.lineWidth = 3; c.strokeStyle = '#1A1411'; c.strokeRect(600, 229, 460, 14);
  brownDude({ x: 820, y: 1300, s: .82, pose: 'hang', expr: 'determined' });
  const ex = ['happy', 'surprised', 'determined', 'tired'];
  ex.forEach((e, i) => { c.save(); c.translate(140 + i * 265, 1560); c.scale(1.45, 1.45); bdHead({ expr: e }); c.restore(); c.font = '700 30px Inter'; c.fillStyle = '#333'; c.fillText(e, 140 + i * 265, 1720) });
  c.restore();
}
export const cues = [];
