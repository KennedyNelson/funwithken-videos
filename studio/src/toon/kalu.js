// KALU CANON (owner directive 2026-11-08): this is THE Kalu for every kaalujokes reel from now on.
// Look = the café reel "World's shortest conversation ever" (Desi Goggle-Eye Toon, src/toon/kp.js). Do not redesign him per video.
// Only change what the owner asks for. Settings and props vary; the character does not.
//   - slightly curved SQUARE head (head:'square'), brown skin #8A5536, light stubble
//   - black plaid fedora (hat:true, black crown + brim with dark-grey checks, lighter band)
//   - black wayfarer sunglasses with two separate lenses (sun:true), so the eyes are hidden: act with brows, mouth, head tilt
//   - black suit, white shirt, dark tie, black trousers and shoes (suit:true)
//   - deadpan by default: flat mouth, tight small talking mouth, NEVER a big grin or laugh unless the owner's idea asks for it
// Battery (best friend, 26): cream suit, clear rectangular specs, shoulder-length centre-parted hair with silver streaks, olive striped tie.
export const KALU = { skin: '#8A5536', head: 'square', hat: true, hatCol: '#15151A', hatChk: '#4C4E5A', hatBand: '#3A3A44', sun: true, top: 'shirt', suit: true, topCol: '#1D1D23', tie: '#2A2A33', pant: '#17171B', shoe: '#0E0E10', stubble: true };
export const BATTERY = { skin: '#C9976A', hair: 'mane', hairCol: '#3A2B22', specs: 'clear', top: 'shirt', suit: true, topCol: '#EDE5D2', tie: '#B3A878', tieStripe: '#6E6745', pant: '#E3DAC4', shoe: '#6B4A32' };
// Kalu's talking mouth: tight and flat (a wide open mouth with teeth reads as a grin). Battery may open wider.
export const kaluTalk = (a, nz = 0) => ({ mouth: 'talk', open: Math.max(.12, Math.min(.42, a * .8)), wide: .16, wideNow: nz * .1 });
// Acting palette for a face that has sunglasses on (brow: negative = stern, positive = worried/raised):
export const KALU_FACES = {
  deadpan: { brow: -.15, look: [.9, 0], mouth: 'flat', wide: .3 },
  stern: { brow: -.3, look: [.9, 0], mouth: 'flat', wide: .3 },
  unimpressed: { brow: -.55, look: [.9, 0], mouth: 'flat', wide: .3 },
  raisedBrow: { brow: .15, browUp: .5, look: [.9, 0], mouth: 'flat', wide: .3 },
  glanceDown: { brow: -.1, look: [.9, .45], mouth: 'flat', wide: .3 },
};
