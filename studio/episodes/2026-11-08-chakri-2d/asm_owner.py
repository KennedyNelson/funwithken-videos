# Owner's own voice recording used directly (no AI voice). Segments of raw/owner-voice.m4a assigned to Kalu / shopkeeper.
# usage: python3 asm_owner.py -> data/mix.wav, words.json, env.json, meta.json
import numpy as np, json, re, subprocess
from scipy.io import wavfile
SR = 16000; O = .45           # lead-in so Kalu can walk up before the first line
# (speaker, text, start, end) in the ORIGINAL recording (voiced bounds found from the RMS envelope)
SEG = [('k', 'Bhaiya, chakri kitne ki di?', .5, 2.3), ('s', 'Do sau ki.', 2.5, 3.55), ('k', 'Bhaiya aapki g**nd ki baat nahi kar raha, sasta karo!', 4.2, 6.2), ('s', '', 6.4, 7.5)]
af = 'highpass=f=80,afftdn=nr=12:nf=-40,loudnorm=I=-15:TP=-1.5'
p = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', 'raw/owner-voice.m4a', '-af', af, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
x = np.frombuffer(p, dtype=np.float32)
DUR = round(O + len(x) / SR + 1.0, 2); n = int(DUR * 30) + 1
mix = np.zeros(int(DUR * SR) + SR, dtype=np.float32); i0 = int(O * SR); mix[i0:i0 + len(x)] = x * .95
wavfile.write('data/mix16.wav', SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', 'data/mix16.wav', '-ar', '44100', '-ac', '2', 'data/mix.wav'])
env = {'k': [0] * n, 's': [0] * n}; W = []; f = SR // 30
for li, (spk, txt, a, b) in enumerate(SEG):
    s, e0 = a + O, b + O; c = np.abs(mix[int(s * SR):int(e0 * SR)]); h = int(.012 * SR); c = np.convolve(c, np.ones(h) / h, 'same')
    voiced = c > max(c.max() * .12, c.mean() * .5); cum = np.cumsum(voiced) / SR; tot = max(cum[-1], .25)
    ws = txt.split(); w8 = [len(re.sub(r'\W', '', w)) + 1.5 for w in ws]; cu = 0
    for w, g in zip(ws, w8):
        pp = cu / sum(w8) * tot; cu += g; q = cu / sum(w8) * tot
        W.append(dict(w=w, line=li, spk=spk, s=round(s + int(np.searchsorted(cum, pp)) / SR, 3), e=round(s + int(np.searchsorted(cum, q)) / SR, 3)))
    m = np.array([c[j * f:(j + 1) * f].mean() for j in range(int(len(c) / f))]); top = np.percentile(m, 95) or 1
    for j, v in enumerate(m):
        idx = int(s * 30) + j
        if idx < n: env[spk][idx] = round(float(np.clip(v / top, 0, 1)), 3)
json.dump(env, open('data/env.json', 'w')); json.dump(W, open('data/words.json', 'w'))
meta = dict(dur=DUR, lines=[[s_[0], round(s_[2] + O, 3), round(s_[3] + O, 3)] for s_ in SEG]); json.dump(meta, open('data/meta.json', 'w')); print(meta)
