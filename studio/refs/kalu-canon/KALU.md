# Kalu canon (owner directive 2026-11-08)

From the café reel "World's shortest conversation ever" (https://www.instagram.com/reel/DfekaGGkcx2/). This is the main Kalu of every kaalujokes reel from now on.
Code: `src/toon/kalu.js` (KALU, BATTERY, kaluTalk, KALU_FACES) drawn by `src/toon/kp.js` (Desi Goggle-Eye Toon). Template episode: `src/stickman-gary/ep-cafe.js`.
Reference frames in this folder: `kalu-closeup.jpg`, `kalu-and-battery-wide.jpg`.

## Kalu (26, the account owner)
- Head: slightly curved square (`head: 'square'`), never oval. Brown skin `#8A5536`, light stubble.
- Black plaid fedora (`hat: true`, black crown and brim, dark-grey checks, slightly lighter band).
- Black wayfarer sunglasses, two separate lenses with glints (`sun: true`). Eyes hidden: act with brows, mouth, head tilt, posture.
- Black suit, white shirt, dark tie, black trousers and shoes (`suit: true`).
- Default acting: deadpan. Flat mouth, tight small talking mouth (`kaluTalk`), small brow moves. No big grin or laugh unless the owner's idea asks for it.
- Keep the look in every reel. Settings, props and the other characters change; Kalu does not. Change something only when the owner asks.

## Battery (26, best friend)
Cream suit, clear rectangular specs, shoulder-length centre-parted hair with silver streaks, olive striped tie, wide goggle eyes. He reacts, Kalu stays deadpan.

## Build notes
- Reel template: `ep-cafe.js` (shots, IK arms, props, over-the-shoulder close-ups, top label via `label`, captions via `captions`).
- Timing/lip-sync: `episodes/<ep>/asm.py` makes words/env/meta from the clip or voice audio; mouths open on the speech envelope.
- Render: `PW_FROM=$(npm root -g)/ node src/stickman-gary/render.mjs <episode> ep-<name> video out.mp4 30`. The blurred café background is slow (about 12 min for 15 s); run it in the background and wait.
- Never put third-party audio into the repo. Hashtags in captions are plain `#` (never %23).
