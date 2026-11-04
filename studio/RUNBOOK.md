# FunWithKen daily short: runbook (for the 9 am scheduled run)

Channel: FunWithKen (YouTube, Zapier connection already linked). Repo: KennedyNelson/funwithken-videos (public; used only to host the finished MP4 so Zapier can fetch it).
Skill to follow for style/comedy/voice rules: `neon-pit-lowpoly-chat-shorts` (look must change EVERY video, see its VARY EVERY VIDEO section; append to its look log in this repo's `studio/LOOKLOG.md`).

## Daily steps (no manual steps, user is not present)
1. Pick a NEW funny script (8 lines, 20-25 s, engineer starts "Claude, ..."; stressed/insulting engineer, Claude calmly saves the day or a similar relatable twist). Don't repeat earlier scripts (see LOOKLOG.md). Choose the new look (hair, clothes, room palette, set, monitor UI).
2. Voices: ElevenLabs via Zapier (app ElevenLabs, action text_to_speech, model eleven_v3, mp3_44100_128). Chris `iP95p4xoKVk53GoZ742B` = engineer, Jessica `cgSgspJ2msm6clMCkdW9` = Claude. Use audio tags ([furious, shouting], [calm, deadpan]...). Download audio_url (host zapier-dev-files.s3.amazonaws.com) with curl, use `ffmpeg -nostdin`.
3. Equalise pace to ~4.6 syl/s: `studio/tools/analyze_pace.py` (measure speech seconds and syllables) then `studio/tools/asm_dialogue.py` (edit SYL/SP tables; makes dialogue.wav, timing.json, env.json). Put them in `studio/data/` (plus `narration.wav` = dialogue.wav, `script.json` = {"music":"bed"}).
4. Build the scene: copy `studio/src` (shots.js poses/shots/EV times, app.js monitor UI, chars.js look, main.js captions) and adapt it to the new script and look. Check frames (`SOFTWARE_GL=1 QS='&res=0.4&aa=0&shadow=1024' FPS=24 node tools/capture.mjs frames review/f "t1,t2"`), run `node tools/capture.mjs cues`, `python3 tools/mix.py .`, then render (`SOFTWARE_GL=1 QS='&res=0.6&aa=0&shadow=1024' FPS=24 node tools/capture.mjs video out.mp4`, ~10 min, run in background and poll). The engine needs a headless Chromium (pre-installed; Playwright) and ffmpeg.
5. Re-encode small: `ffmpeg -i out.mp4 -c:v libx264 -crf 21 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart YYYY-MM-DD-slug.mp4`, copy to repo root, `git add/commit/push origin main`.
6. Upload: Zapier YouTube `upload_video` with video = `https://raw.githubusercontent.com/KennedyNelson/funwithken-videos/main/<file>.mp4`, short title, description with "Voices: ElevenLabs" and #Shorts, privacy_status public, made_for_kids false, category_id 28.
7. Log: add the video (title, script summary, look, YouTube id) to `studio/LOOKLOG.md` and push.

Notes: free ElevenLabs plan (needs attribution line in the description). Captions censor swear words (sh*t). GitHub is the only host reachable from the sandbox besides Zapier's S3.
