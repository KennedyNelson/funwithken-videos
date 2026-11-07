# Code animation styles pack (added 2026-11-07, from the owner's "Claude Animation Styles" zip)
10 looks drawn entirely in code: Pixel Art, Chalkboard, Glow Sketch, PS2, Comic Art, Flat Vector, Line-and-Dot Minimal (Dan Koe inspired), CGI Motion, Toy Brick (Lego inspired), Clay 3D Explainer (ZackD inspired).
- references/styles/<style>.md: the rules for each look (must-haves, how to fit any script, motion, text, avoid, code starter).
- references/workflow.md, references/checklist.md: script to beats to frames, and the pre-export check.
- references/player-template.html: one-file player with draw(t), seeded rand(), scrub and an in-browser Export button.
- scripts/render.mjs: frame-exact MP4 from such an HTML file (`node studio/styles-pack/scripts/render.mjs file.html out.mp4 --audio data/mix.wav`; needs node, ffmpeg and playwright, all present in our sandbox).
How these fit our pipeline and channel rules: see the CODE ANIMATION PACK section of the shorts-animation-styles skill.
