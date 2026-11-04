# Neon Pit — low-poly AI-chat style (KennyExplains)

Analysed from the reference "engineer vs AI" low-poly shorts, then re-coloured and varied so it is our own.

## What the reference does (the grammar we keep)
- Flat-shaded low-poly 3D toy diorama: every surface visibly faceted, no smooth gradients on characters.
- Cinematic dark room: one warm key with bloom, a cool rim, shallow depth of field (bokeh dots), heavy vignette, light grain.
- AI character = chunky blocky slab with stubby legs, tall black rounded-rect eyes with a tiny highlight, blush. Human = faceted head, dot eyes, hoodie.
- Set = dark office with glowing code monitors, a neon creator-handle sign on the wall.
- Camera: close-ups with slight dutch roll and slow push-in; ONE CUT PER SENTENCE; cut to the monitor whenever the AI does something on screen (the visual gag).
- Captions: small, sentence case, mid-frame, colour-coded by speaker.
- Sound: whoosh on every cut, soft pop/thud/sparkle on screen events, very quiet pad.

## Our variations ("Neon Pit")
| Thing | Reference | Ours |
|---|---|---|
| Room | dark teal/brown | aubergine / ink-violet `#0A0616` |
| Key light | warm orange | blush-magenta `#FFB59E` + point `#FF4FA3` |
| Rim light | cool blue | cyan `#3DE7FF`, mint + electric-blue accents |
| AI | orange slab | apricot `#FF9466` slab, 4 legs, side nubs, glowing MINT GEM on a stalk (the gem droops when sad, sparkles when smug) |
| Human | lego-ish figure | NOT lego: smooth-faceted round head, round glasses, indigo spiky hair `#2D2358`, teal hoodie `#2FB8A6`, coral drawstrings, capsule arms |
| Sign | creator handle | "@KennyExplains" neon |
| Captions | white / tan | engineer `#F6F1FF`, Claude `#FFB58E`, Inter 800, dark translucent rounded backing |
| Screen | code | 2D canvas texture with a fake app UI that visibly reacts (button turns blue, bloat, dark mode, undo spinner, ✓) |

## Rules
1. One cut per spoken line; monitor cut for every on-screen gag; never hold a shot > 3 s.
2. Emotion lives in the face rig: brows, lid/wide, mouth open (driven by audio envelope), shake for panic, lean/tilt, gem droop.
3. Human stays 2D-ish/minimal 3D — no brick limbs, no stud heads.
4. Keep voices on the same pace (~5 syllables/s, atempo-normalised) but vary pitch/loudness for emotion.
5. Captions chunked ≤ 2 lines, synced to word times from the audio envelope.
6. Render: SOFTWARE_GL=1 QS='&res=0.6&aa=0&shadow=1024' FPS=24 node tools/capture.mjs video out.mp4 (draft); full quality on a GPU machine.

## Files (project `~/faceless-shorts/lowpoly-chat/`)
src/core/engine.js (renderer, bloom, DOF) · chars.js (makeClaude, makeEngineer, makeMouth) · app.js (2D screen UI) · shots.js (set, keyframes, shots S01–S14, EV timings, cues) · main.js (captions, timeline).
