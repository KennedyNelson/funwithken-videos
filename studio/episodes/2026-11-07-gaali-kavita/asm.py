# Timing for the gaali-kavita reel: the owner adds the original audio later, so the video is built to the clip's own timeline.
# Speaker windows come from the owner's transcript + the clip's speech envelope; words spread over voiced frames in each window.
import numpy as np, json, re, subprocess
from scipy.io import wavfile
L = json.load(open('lines.json')); DUR = 40.87
sr, x = wavfile.read('data/orig16k.wav'); x = x.astype(float) / 32768
h = int(.012 * sr); e = np.convolve(np.abs(x), np.ones(h) / h, 'same'); voiced = e > e.max() * .06
W = []
for i, (spk, a, b, txt) in enumerate(L):
    A, B = int(a * sr), int(b * sr); v = voiced[A:B]; cum = np.cumsum(v) / sr; tot = max(cum[-1], .2)
    ws = txt.split(); w8 = [len(re.sub(r'\W', '', w)) + 1.5 for w in ws]; c = 0
    for w, g in zip(ws, w8):
        p = c / sum(w8) * tot; c += g; q = c / sum(w8) * tot
        W.append(dict(w=w, line=i, spk=spk, s=round(a + int(np.searchsorted(cum, p)) / sr, 3), e=round(a + int(np.searchsorted(cum, q)) / sr, 3)))
# lip envelope per speaker at 30 fps: speech energy masked to that speaker's windows
f = sr // 30; n = int(DUR * 30) + 1; env = {'k': [0] * n, 'f': [0] * n}
m = np.array([e[i * f:(i + 1) * f].mean() if i * f < len(e) else 0 for i in range(n)]); m = np.clip(m / np.percentile(m, 97) * 1.2, 0, 1)
for spk, a, b, _ in L:
    for i in range(int(a * 30), min(n, int(b * 30) + 1)): env[spk][i] = round(float(m[i]), 3)
json.dump(env, open('data/env.json', 'w')); json.dump(W, open('data/words.json', 'w'))
json.dump(dict(dur=DUR, lines=[[l[0], l[1], l[2]] for l in L]), open('data/meta.json', 'w'))
# silent mix (owner adds the real audio) + a preview mix with the original audio for a sync check
wavfile.write('data/mix.wav', 44100, np.zeros(int(DUR * 44100), dtype=np.int16))
print(len(W), 'words')
