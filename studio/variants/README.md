# Style variants (Kalu & Bettery two-friend banter, 2026-11-05)
Each folder holds only the files that differ from its base engine; copy them over a fresh project and keep the rest.
- `../src/stickman/`: Stickman engine (canvas `index.html` + `scene.js`, `render.mjs` Playwright capture, `mkaudio8.py` audio/timing builder). Fonts: Inter Black (IB) and Inter (IX) loaded in index.html.
- `neonpit-park/`: bright daytime park Neon Pit. Base = `studio/` engine. `chars.js` has `makeEngineer(opts)` (skin, hair, tee, pant, specs, hairBlocks). Two-shot camera, no glow.
- `tall-tale-friends/`: base = faceless-shorts `tall-tale` (`toon.js` has the `hat: 'crop'` black hair).
- `stick-story-friends/`: base = faceless-shorts `stick-story` (`kit.js` has `talk` mouth and `specs`).
- `paper-atlas-friends/`: base = faceless-shorts `paper-atlas` (people drawn in `shots.js`).
All variants read `src/env.js`: `{ENV:{K,B}, TM:{T,A}}` from the audio builder. PITFALL: the builder's env keys are by line prefix, so make sure ENV matches the speaker (in 2026-11-05 data K and B were swapped; the shots remap them).
