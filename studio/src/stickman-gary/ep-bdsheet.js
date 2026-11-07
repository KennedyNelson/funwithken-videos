// Brown Dude model sheet (reference image for the style). Not a video.
import { W, H, bind, ctx, label } from '../toon/toon.js';
import { brownDude, bdHead, plate, PLATES } from '../toon/brownDude.js';
export const DUR = 1; let c;
export function init(cx) { c = cx; bind(c) }
export function draw(t) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); plate(PLATES.cream);
  c.font = '900 64px Inter'; c.textAlign = 'center'; c.fillStyle = '#1b1b1b'; c.fillText('BROWN DUDE', W / 2, 120);
  c.font = '700 34px Inter'; c.fillStyle = '#555'; c.fillText('model sheet: fitness + body-science character', W / 2, 172);
  brownDude({ x: 270, y: 1130, s: .78, pose: 'armsCrossed', expr: 'focused' });
  brownDude({ x: 800, y: 1130, s: .78, pose: 'point', expr: 'smug' });
  brownDude({ x: 270, y: 1840, s: .52, pose: 'hang', expr: 'angry', sweat: true });
  brownDude({ x: 790, y: 1840, s: .52, pose: 'flex', expr: 'calm' });
  const ex = ['focused', 'angry', 'calm', 'tired', 'shocked', 'smug'];
  c.restore();
}
export const cues = [];
